# uptime-plugin-slack
Uptime plugin for slack incoming messages

## Getting Started

```shell
$ cd /path/to/your/uptime/installation/folder
$ git clone git@github.com:waltzofpearls/uptime-plugin-slack.git plugins/slack
```

## Configuration

Add the following line under `plugins` to enable the slack plugin

```yaml
  - ./plugins/slack
```

Add the following slack plugin config to `config/production.yaml`

```yaml
slack:
  webhook: [slack webhook url]
  channel: '[slack channel name]' # default '#general'
  username: [slack username] # default 'Uptime Alert'
  icon_emoji: [emoji icon for [username]] # default ':turtle:'
  icon_url: [optional, icon_url for [username]] # default empty, icon_url overrides icon_emoji
  event:
    up:        true
    down:      true
    paused:    false
    restarted: false
```

## License

The MIT License (MIT)

Copyright (c) 2015 Rollie Ma @ Topbass Labs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
