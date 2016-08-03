package sevenam

import (
  "fmt"
  "log"
  "net/http"
  "github.com/gorilla/mux"
  "io/ioutil"
)
var config *serverConfig

func main() {
  var err error
  config, err = readConfig("config.yml")
  if err != nil {
    log.Fatal(err)
  }

  r := mux.NewRouter()
  r.HandleFunc("/", RssHandler).
  Methods("GET")
  http.Handle("/", r)

  log.Fatal(http.ListenAndServe(":8080", nil))
}

func RssHandler(w http.ResponseWriter, r *http.Request) {
  resp, err := http.Get(config.NewsUrl)
  if err != nil {
    fmt.Fprintf(w, "%+v\n", err)
  }
  defer resp.Body.Close()
  body, err := ioutil.ReadAll(resp.Body)
  fmt.Fprintf(w, "%s", body)
}

