
$(GOPATH)/bin/livebook: server.go cradle/cradle.go
	godep go install -v ./...
