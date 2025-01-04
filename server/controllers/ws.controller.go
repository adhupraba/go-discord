package controllers

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-jet/jet/v2/qrm"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"github.com/adhupraba/discord-server/internal/discord/public/model"
	"github.com/adhupraba/discord-server/internal/queries"
	"github.com/adhupraba/discord-server/lib"
	"github.com/adhupraba/discord-server/types"
	"github.com/adhupraba/discord-server/utils"
)

type WsController struct{}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (wc *WsController) Connect(w http.ResponseWriter, r *http.Request) {
	fmt.Println("connect endpoint reached")

	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error establishing websocket channel connection")
		return
	}

	fmt.Println("websocket conn established")

	mem := &lib.WsClient{
		Conn:    conn,
		Message: make(chan *types.WsOutgoingMessage),
	}

	lib.WsHub.Register <- mem

	defer func() {
		lib.WsHub.Unregister <- mem
		conn.Close()
	}()

	go mem.WriteMessage()

	mem.ReadMessage()
}

func (wc *WsController) SendChanMessage(w http.ResponseWriter, r *http.Request, user model.Profiles) {
	var body types.WsIncomingMessageBody
	err := utils.BodyParser(r.Body, &body)

	if err != nil {
		utils.RespondWithError(w, http.StatusUnprocessableEntity, "Invalid data")
		return
	}

	serverId := r.URL.Query().Get("serverId")
	channelId := r.URL.Query().Get("channelId")

	member, _, errCode, err := validateServer_Channel_Member(validateChanMessageParams{
		Ctx:       r.Context(),
		UserID:    user.ID,
		ServerID:  serverId,
		ChannelID: channelId,
	})

	if err != nil {
		utils.RespondWithError(w, errCode, err.Error())
		return
	}

	wsMessage, err := lib.BroadcastMessage(member.ID.String(), channelId, types.WsRoomTypeCHANNEL, body)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJson(w, http.StatusOK, wsMessage)
}

func (wc *WsController) EditChanMessage(w http.ResponseWriter, r *http.Request, user model.Profiles) {
	idQ := chi.URLParam(r, "messageId")

	var messageId *uuid.UUID
	msgId, err := uuid.Parse(idQ)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid message id")
		return
	}

	messageId = &msgId

	type updateMessageBody struct {
		Content string `json:"content" validate:"required,min=1"`
	}

	var body updateMessageBody
	err = utils.BodyParser(r.Body, &body)

	if err != nil {
		utils.RespondWithError(w, http.StatusUnprocessableEntity, "Invalid data")
		return
	}

	member, message, errCode, err := validateServer_Channel_Member(validateChanMessageParams{
		Ctx:       r.Context(),
		UserID:    user.ID,
		ServerID:  r.URL.Query().Get("serverId"),
		ChannelID: r.URL.Query().Get("channelId"),
		MessageID: messageId,
	})

	if err != nil {
		utils.RespondWithError(w, errCode, err.Error())
		return
	}

	isMessageOwner := message.MemberID.String() == member.ID.String()

	if !isMessageOwner {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	updMessage, err := lib.DB.UpdateMessageByID(r.Context(), message.ID, body.Content)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	go func() {
		lib.WsHub.Broadcast <- updMessage
	}()

	utils.RespondWithJson(w, http.StatusOK, updMessage)
}

func (wc *WsController) DeleteChanMessage(w http.ResponseWriter, r *http.Request, user model.Profiles) {
	idQ := chi.URLParam(r, "messageId")

	var messageId *uuid.UUID = nil
	msgId, err := uuid.Parse(idQ)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid message id")
		return
	}

	messageId = &msgId

	member, message, errCode, err := validateServer_Channel_Member(validateChanMessageParams{
		Ctx:       r.Context(),
		UserID:    user.ID,
		ServerID:  r.URL.Query().Get("serverId"),
		ChannelID: r.URL.Query().Get("channelId"),
		MessageID: messageId,
	})

	if err != nil {
		utils.RespondWithError(w, errCode, err.Error())
		return
	}

	isMessageOwner := message.MemberID.String() == member.ID.String()
	isAdmin := member.Role == model.MemberRoleADMIN
	isModerator := member.Role == model.MemberRoleMODERATOR
	canModify := isMessageOwner || isAdmin || isModerator

	if !canModify {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	updMessage, err := lib.DB.DeleteMessageByID(r.Context(), message.ID)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	go func() {
		lib.WsHub.Broadcast <- updMessage
	}()

	utils.RespondWithJson(w, http.StatusOK, updMessage)
}

func (wc *WsController) SendDirectMessage(w http.ResponseWriter, r *http.Request, user model.Profiles) {
	var body types.WsIncomingMessageBody
	err := utils.BodyParser(r.Body, &body)

	if err != nil {
		utils.RespondWithError(w, http.StatusUnprocessableEntity, "Invalid data")
		return
	}

	conversationId := r.URL.Query().Get("conversationId")

	member, _, errCode, err := validateConversation_Member(validateDirectMessageParams{
		Ctx:            r.Context(),
		UserID:         user.ID,
		ConversationID: conversationId,
	})

	if err != nil {
		utils.RespondWithError(w, errCode, err.Error())
		return
	}

	wsMessage, err := lib.BroadcastMessage(member.ID.String(), conversationId, types.WsRoomTypeCONVERSATION, body)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJson(w, http.StatusOK, wsMessage)
}

func (wc *WsController) EditDirectMessage(w http.ResponseWriter, r *http.Request, user model.Profiles) {
	idQ := chi.URLParam(r, "messageId")

	var messageId *uuid.UUID
	msgId, err := uuid.Parse(idQ)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid message id")
		return
	}

	messageId = &msgId

	type updateMessageBody struct {
		Content string `json:"content" validate:"required,min=1"`
	}

	var body updateMessageBody
	err = utils.BodyParser(r.Body, &body)

	if err != nil {
		utils.RespondWithError(w, http.StatusUnprocessableEntity, "Invalid data")
		return
	}

	log.Printf("user id = %v, server id = %v, channel id = %v, message id = %v\n", user.ID, r.URL.Query().Get("serverId"), r.URL.Query().Get("channelId"), messageId)

	member, message, errCode, err := validateConversation_Member(validateDirectMessageParams{
		Ctx:            r.Context(),
		UserID:         user.ID,
		ConversationID: r.URL.Query().Get("conversationId"),
		MessageID:      messageId,
	})

	if err != nil {
		utils.RespondWithError(w, errCode, err.Error())
		return
	}

	isMessageOwner := message.MemberID.String() == member.ID.String()

	if !isMessageOwner {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	updMessage, err := lib.DB.UpdateDirectMessageByID(r.Context(), message.ID, body.Content)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	go func() {
		lib.WsHub.Broadcast <- updMessage
	}()

	utils.RespondWithJson(w, http.StatusOK, updMessage)
}

func (wc *WsController) DeleteDirectMessage(w http.ResponseWriter, r *http.Request, user model.Profiles) {
	idQ := chi.URLParam(r, "messageId")

	var messageId *uuid.UUID = nil
	msgId, err := uuid.Parse(idQ)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid message id")
		return
	}

	messageId = &msgId

	member, message, errCode, err := validateConversation_Member(validateDirectMessageParams{
		Ctx:            r.Context(),
		UserID:         user.ID,
		ConversationID: r.URL.Query().Get("conversationId"),
		MessageID:      messageId,
	})

	if err != nil {
		utils.RespondWithError(w, errCode, err.Error())
		return
	}

	isMessageOwner := message.MemberID.String() == member.ID.String()

	if !isMessageOwner {
		utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	updMessage, err := lib.DB.DeleteDirectMessageByID(r.Context(), message.ID)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	go func() {
		lib.WsHub.Broadcast <- updMessage
	}()

	utils.RespondWithJson(w, http.StatusOK, updMessage)
}

type validateChanMessageParams struct {
	Ctx       context.Context
	UserID    uuid.UUID
	ServerID  string
	ChannelID string
	MessageID *uuid.UUID
}

func validateServer_Channel_Member(params validateChanMessageParams) (member *model.Members, message *model.Messages, errCode int, e error) {
	serverId, err := uuid.Parse(params.ServerID)

	if err != nil {
		return nil, nil, http.StatusBadRequest, errors.New("Invalid server id")
	}

	channeId, err := uuid.Parse(params.ChannelID)

	if err != nil {
		return nil, nil, http.StatusBadRequest, errors.New("Invalid channel id")
	}

	server, err := lib.DB.GetServerAndMembersOfUser(params.Ctx, queries.GetServerAndMembersOfUserParam{
		ServerId:  serverId,
		ProfileId: params.UserID,
	})

	if err == qrm.ErrNoRows {
		return nil, nil, http.StatusNotFound, errors.New("Server not found")
	}

	if err != nil {
		log.Println("get server and members error:", err)
		return nil, nil, http.StatusInternalServerError, errors.New("Error getting server details")
	}

	chann, err := lib.DB.GetServerChannel(params.Ctx, queries.GetServerChannelParams{
		ServerId:  &server.ID,
		ChannelId: channeId,
	})

	if err == qrm.ErrNoRows {
		return nil, nil, http.StatusNotFound, errors.New("Channel not found")
	}

	if err != nil {
		log.Println("get channel error:", err)
		return nil, nil, http.StatusInternalServerError, errors.New("Error getting channel details")
	}

	for _, sMem := range server.Members {
		if sMem.ProfileID.String() == params.UserID.String() {
			member = &sMem
			break
		}
	}

	if member == nil {
		return nil, nil, http.StatusNotFound, errors.New("Member not found")
	}

	if params.MessageID != nil {
		message, err = lib.DB.GetMessageByID(params.Ctx, queries.GetMessageByIDParams{
			ID:        *params.MessageID,
			ChannelID: &chann.ID,
		})

		if err == qrm.ErrNoRows {
			return nil, nil, http.StatusNotFound, errors.New("Message not found")
		}

		if err != nil {
			return nil, nil, http.StatusInternalServerError, errors.New("Error finding message")
		}

		if message.Deleted {
			return nil, nil, http.StatusNotFound, errors.New("Message not found")
		}
	}

	return member, message, 0, nil
}

type validateDirectMessageParams struct {
	Ctx            context.Context
	UserID         uuid.UUID
	ConversationID string
	MessageID      *uuid.UUID
}

func validateConversation_Member(params validateDirectMessageParams) (member *model.Members, message *model.DirectMessages, errCode int, e error) {
	conversationId, err := uuid.Parse(params.ConversationID)

	if err != nil {
		return nil, nil, http.StatusBadRequest, errors.New("Invalid channel id")
	}

	conv, err := lib.DB.GetConversationWithMembersByID(params.Ctx, queries.GetConversationWithMembersByIDParams{
		ConversationID: conversationId,
		ProfileID:      &params.UserID,
	})

	if err == qrm.ErrNoRows {
		return nil, nil, http.StatusNotFound, errors.New("Conversation not found")
	}

	if err != nil {
		return nil, nil, http.StatusInternalServerError, errors.New("Error getting channel details")
	}

	if conv.MemberOne.ProfileID.String() == params.UserID.String() {
		member = &conv.MemberOne.Members
	} else {
		member = &conv.MemberTwo.Members
	}

	if params.MessageID != nil {
		message, err = lib.DB.GetDirectMessageByID(params.Ctx, *params.MessageID)

		if err == qrm.ErrNoRows {
			return nil, nil, http.StatusNotFound, errors.New("Message not found")
		}

		if err != nil {
			return nil, nil, http.StatusInternalServerError, errors.New("Error finding message")
		}

		if message.Deleted {
			return nil, nil, http.StatusNotFound, errors.New("Message not found")
		}
	}

	return member, message, 0, nil
}
