package lib

import (
	"errors"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type envConfig struct {
	Port               string
	DbUrl              string
	Env                string
	CorsAllowedOrigins []string
	ClerkSecretKey     string
}

var EnvConfig envConfig

func LoadEnv() {
	if _, err := os.Stat(".env"); errors.Is(err, os.ErrNotExist) {
		log.Println(".env file not found. using system environment variables")
	} else {
		err := godotenv.Load()

		if err != nil {
			log.Fatal("Unable to load .env:", err)
		}
	}

	var env string = os.Getenv("ENV")

	if env == "" {
		env = "development"
	}

	EnvConfig = envConfig{
		Port:               os.Getenv("PORT"),
		DbUrl:              os.Getenv("DB_URL"),
		Env:                env,
		CorsAllowedOrigins: []string{},
		ClerkSecretKey:     os.Getenv("CLERK_SECRET_KEY"),
	}

	if os.Getenv("CORS_ALLOWED_ORIGINS") == "" {
		EnvConfig.CorsAllowedOrigins = []string{"*"}
	} else {
		EnvConfig.CorsAllowedOrigins = strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ",")
	}

	if EnvConfig.Port == "" {
		log.Fatal("PORT is not found in the environment")
	}

	if EnvConfig.DbUrl == "" {
		log.Fatal("DB_URL is not found in the environment")
	}

	if EnvConfig.ClerkSecretKey == "" {
		log.Fatal("CLERK_SECRET_KEY is not found in the environment")
	}
}
