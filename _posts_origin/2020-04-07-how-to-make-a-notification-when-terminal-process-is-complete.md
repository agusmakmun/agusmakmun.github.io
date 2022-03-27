---
layout: post
title:  "How to make a notification when terminal process is complete"
date:   2020-04-07 14:32:04 +0700
categories: [bash, linux, ubuntu]
---

I have started a long process through a terminal. Is it possible to make the Ubuntu terminal make a sound once the process is complete?
This way, I don’t need to keep checking, but will instead be notified through a sound or another notification.

You can use this some alternatives;


```bash
$ your-bash-command && aplay /path/to/sound.wav  # can also with *.ogg file.
```

```bash
$ your-bash-command && paplay /path/to/sound.ogg  # can also with *.wav file.
```

```bash
$ your-bash-command; spd-say "done"
```

```bash
$ your-bash-command && notify-send "done"  # without sound
$ your-bash-command && notify-send "Process completed" "Come back to the terminal, the task is over"
```

------------

And this script below is modification of that commands above.

1. Create the `notif-me.sh` file;

```bash
#!/bin/bash

notify-send "Process completed" "Come back to the terminal, the task is over"
spd-say "My lord, your process hasbeen complete."
```

2. Make it callable in `/bin`

```bash
sudo cp notif-me.sh /bin/notif-me;
```

3. Use it;

```bash
$ your-bash-command; notif-me

# or

$ your-bash-command && notif-me
```
