# waiting room bot

much code taken from [breakout room bot](https://github.com/HackyExtensionsForZoomMeetings/BreakoutRoomsBotForZoomMeetings)

## installation

1. [download the zip](https://github.com/cjquines/waiting-room-bot/archive/master.zip). unzip it somewhere.
2. open a new tab, type `chrome://extensions/` in the url.
3. turn developer mode on. (it's the switch in the upper-right.)
4. click load unpacked (in the top left). select the "extension" folder that you unzipped (it may be in the folder called waiting-room-bost-master folder).

if it worked, you should see "Waiting Room Bot for Zoom Meetings" be installed as a new extension.

## usage

1. join a zoom meeting using your browser. make sure you become cohost.
2. click the extension in your menu bar to open the popup.
    * if it's not there, you might have to click the puzzle piece, and *then* click the extension.
3. paste the list of names into the big textbox.
    * the list of names should be one entry per line. each line should be some text, then tab, then the name, then tab, then any other text. for example:
```
1	Edward Stanley Pembroke	12	School, MA
2	Carl Joshua Quines	11	School, MA
```
    * day-of, you'll be getting the names from [the class roster link](https://esp.mit.edu/teach/Splash/2020/section_students/20225). just select the entire table, from before the "1" on the first row to the last row.

4. click "attach and launch"

if it worked, it should send an "active!" message to the chat. do not close the chat window. do not join audio. use another zoom client to actually participate in the meeting.
