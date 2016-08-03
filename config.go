package sevenam

import (
  "gopkg.in/yaml.v2"
  "errors"
  "path"
  "io/ioutil"
)

type serverConfig struct {
  Newstime int
  Timezone string
  NewsUrl string
  CacheFile string
  Interval int
}

func (c *serverConfig) UnmarshalYAML(unmarshal func(interface{}) error) error {
  var aux struct {
    Newstime int `yaml:"newsTime"`
    Timezone string `yaml:"timezone"`
    NewsUrl string `yaml:"newsUrl"`
    CacheFile string `yaml:"cacheFile"`
    Interval int `yaml:"interval"`
  }

  if err := unmarshal(&aux); err != nil {
    return err
  }
  if aux.Newstime == 0 {
    return errors.New("config: invalid `Newstime`")
  }
  if aux.Timezone == "" {
    return errors.New("config: invalid `Timezone`")
  }
  if aux.NewsUrl == "" {
    return errors.New("config: invalid `NewsUrl`")
  }
  if aux.CacheFile == "" {
    aux.CacheFile = "cache.json"
  }
  if aux.Interval == 0 {
    aux.Interval = 300000
  }

  c.Newstime = aux.Newstime
  c.Timezone = aux.Timezone
  c.NewsUrl = aux.NewsUrl
  c.CacheFile = aux.CacheFile
  c.Interval = aux.Interval
  return nil
}

func readConfig(file string) (*serverConfig, error) {
  configFile := path.Join(file)

  data, err := ioutil.ReadFile(configFile)
  if err != nil {
    return nil, err
  }

  var config serverConfig
  if err := yaml.Unmarshal(data, &config); err != nil {
    return nil, err
  }

  return &config, nil
}
