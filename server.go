package main

import (
  "fmt"
  "log"
  "net/http"
  "github.com/gorilla/mux"
  "io/ioutil"
  "regexp"
  "github.com/jasonlvhit/gocron"
  "time"
)

var config *serverConfig

func main() {
  var err error
  config, err = readConfig("config.yml")
  if err != nil {
    log.Fatal(err)
  }

  GetNews()
  gocron.Every(5).Minutes().Do(GetNews)

  go gocron.Start()

  r := mux.NewRouter()
  r.HandleFunc("/", RssHandler).
  Methods("GET")
  http.Handle("/", r)

  log.Fatal(http.ListenAndServe(":8080", nil))
}

func RssHandler(w http.ResponseWriter, r *http.Request) {
  cache, err := ioutil.ReadFile(config.CacheFile)
  check(err)
  fmt.Fprintf(w, string(cache))
}

func GetNews() {
  log.Print("getting news")
  if GetEst().Hour() != 7 {
    return
  }
  resp, err := http.Get(config.NewsUrl)
  check(err)
  defer resp.Body.Close()

  body, err := ioutil.ReadAll(resp.Body)
  check(err)

  match, err := regexp.Match("7AM ET", body)
  check(err)

  if match {
    err = ioutil.WriteFile(config.CacheFile, body, 0644)
    check(err)
  }
}

func GetEst() (hour time.Time) {
  t := time.Now()
  est, err := time.LoadLocation("America/New_York")
  check(err)
  return t.In(est)
}

func check(e error) {
  if e != nil {
    panic(e)
  }
}
