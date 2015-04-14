package main

import (
	"github.com/dtannen/engage/handlers"
	"github.com/zenazn/goji"
	"golang.org/x/net/websocket"
	"net/http"
)

func main() {
	// HTTP Routing
	setupRouting()
}

func setupRouting() {
	goji.Get("/", handlers.AppHandler)
	goji.Handle("/api/data", websocket.Handler(handlers.WSHandler))

	// Static file serving
	goji.Get("/static/*", http.StripPrefix("/static", http.FileServer(http.Dir("static"))))

	goji.Serve()
}
