package projector

import (
	"encoding/json"
	"os"
	"path"
)

type Data struct {
	Projector map[string]map[string]string `json:"projector"`
}

type Projector struct {
	config *Config
	data   *Data
}

func CreateProjector(config *Config, data *Data) *Projector {
    return &Projector{
        config: config,
        data: data,
    }
}

func (p *Projector) GetValue(key string) (string, bool) {

    curr := p.config.Pwd
    prev := ""

    out := ""
    found := false
    for ; curr != prev; {

        if dir, ok := p.data.Projector[curr]; ok {
            if value, ok := dir[key]; ok {
                out = value
                found = true
                break
            }
        }

        prev = curr
        curr = path.Dir(curr)
    }

    return out, found
}


func (p *Projector) GetValueAll() map[string]string {
    out := map[string]string{}

    paths := []string{}
    curr := p.config.Pwd
    prev := ""

    for ; curr != prev; {
        paths = append(paths, curr)
        prev = curr
        curr = path.Dir(curr)
    }

    for i := len(paths) - 1; i >= 0; i-- {

        if dir, ok := p.data.Projector[paths[i]]; ok {
            for k, v := range dir {
                out[k] = v
            }
        }

    }

    return out
}

func (p *Projector) SetValue(key, value string) {
    pwd := p.config.Pwd
    if _, ok := p.data.Projector[pwd]; !ok {
        p.data.Projector[pwd] = map[string]string{}
    }

    p.data.Projector[pwd][key] = value
}

func (p *Projector) RemoveValue(key string) {
    pwd := p.config.Pwd
    if dir, ok := p.data.Projector[pwd]; ok {
        delete(dir, key)
    }
}

func (p *Projector) Save() error {
    dir := path.Dir(p.config.Config)
    if _, err := os.Stat(dir); os.IsNotExist(err) {
        err = os.MkdirAll(dir, 0755)
        if err != nil {
            return err
        }
    }

    jsonString, err := json.Marshal(p.data)
    if err != nil {
        return err
    }

    os.WriteFile(p.config.Config, jsonString, 0755)
    return nil
}

func defaultProjector(config *Config) *Projector {
    return &Projector{
        config: config,
        data: &Data{
            Projector: map[string]map[string]string{},
        },
    }
}

func NewProjector(config *Config) *Projector {
    if _, err := os.Stat(config.Config); err == nil {
        contents, err := os.ReadFile(config.Config)
        if err != nil {
            return defaultProjector(config)
        }

        var data Data
        err = json.Unmarshal(contents, &data);
        if err != nil {
            return defaultProjector(config)
        }

        return &Projector{
            data: &data,
            config: config,
        }
    }
    return defaultProjector(config)
}

