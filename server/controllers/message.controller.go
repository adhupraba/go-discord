package controllers

import (
	"net/http"

	"github.com/google/uuid"

	"github.com/adhupraba/discord-server/internal/discord/public/model"
	"github.com/adhupraba/discord-server/internal/helpers"
	"github.com/adhupraba/discord-server/internal/queries"
	"github.com/adhupraba/discord-server/lib"
	"github.com/adhupraba/discord-server/types"
	"github.com/adhupraba/discord-server/utils"
)

type MessageController struct{}

type GetMessagesRes struct {
	NextCursor *string                  `json:"nextCursor"`
	Messages   []types.WsMessageContent `json:"messages"`
}

func (mc *MessageController) GetMessages(w http.ResponseWriter, r *http.Request, profile model.Profiles) {
	cursor := r.URL.Query().Get("cursor")
	lastMsgId, lastMsgDate, err := helpers.ValidateCursor(cursor)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	channelIdQuery := r.URL.Query().Get("channelId")

	if channelIdQuery == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Channel ID missing")
		return
	}

	channelId, err := uuid.Parse(channelIdQuery)

	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid channel id")
		return
	}

	messages, nextCursor, err := lib.DB.GetMessages(r.Context(), queries.GetMessagesParams{
		ChannelId:       channelId,
		LastMessageId:   lastMsgId,
		LastMessageDate: lastMsgDate,
	})

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	res := GetMessagesRes{
		NextCursor: nextCursor,
		Messages:   messages,
	}

	utils.RespondWithJson(w, http.StatusOK, res)
}
