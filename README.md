🐙

Octopus is a prototype tool for quickly building complex search strings, and then searching those strings in multiple databases at once.

Quick Guide
  -	Put your keyword in the ‘Keyword’ field, and lists of words you want to put before or after in the fields either side (lists must be separated by a comma and a space).
  -	Hit enter to build the string, then direct it to the databases by clicking ‘Search’ or ‘Search Selected’.
  -	For proximity search, enter the distance in the ‘Near N’ field, then a list of words you want within that distance of your keyword.
  -	Date ranges can be defined in the ‘From’ and ‘To’ fields.


Full guide

Required browser settings: Pop-ups/redirects must be enabled in your browser so that Octopus can open up multiple tabs at once:

  -	Click on the three dots in the top right corner of Chrome
  -	Click ‘settings’
  -	Click ‘Privacy and security’ on the right-hand menu
  -	Select ‘Site Settings’
  -	At the bottom of the menu, click ‘Pop-ups and redirects’
  -	Select the radio button ‘Sites can send pop-ups and use redirects’

Make sure you’re logged into all the databases before using Octopus.

Basic use 

The ‘In’ section of Octopus is where you input your words, and the ‘Out’ section is where the search strings will appear, before they’re directed to the databases. You can output a simple keyword search to multiple databases:
  -	Type your word into the ‘Keyword’ field (this is the minimum requirement for an Octopus search)
  -	Add a date range in the ‘From’ and/or ‘To’ fields, if needed. For everything before a certain date (i.e. for antedating), just fill in ‘To’ and leave ‘From’ empty; for everything after a certain date (for postdating), fill ‘From’ and leave ‘To’ empty. These must be 4-digit years.
  -	Click ‘Add’, or hit Enter, and your keyword appears in the ‘Out’ section
  -	From here, you can:
    o	Copy the output to your clipboard by clicking ‘Copy’
    or
    o	Run the search in each database separately by clicking ‘Search’ (this opens a new tab)
    or
    o	Run the search in multiple database by clicking ‘Search selected’ (this opens multiple tabs)
    
Hit ‘Clear’ in either the In or Out section to refresh the fields.

Building collocate searches

Octopus combines lists of words in the ‘Before’ and/or ‘After’ fields with your keyword. It encloses these combinations in quotation marks, and joins them with the ‘OR’ operator. The ‘Before’/’After’ fields take lists of words separated by a comma and a space. So for the following input

    Before: strong, weak, tall, short, athletic, narrow, stout, broad

    Keyword: build

You’ll get

    "strong build" OR "weak build" OR "tall build" OR "short build" OR "athletic build" OR "narrow build" OR "stout build" OR "broad build"
  
For

    Keyword: build

    After: up, in, out, down, against, to
  
You’ll get 

    "build up" OR "build in" OR "build out" OR "build down" OR "build against" OR "build to"
  
For 

    Before: I, you, we, they

    Keyword: build

    After: ships, boats, canoes
  
You’ll get

    "I build ships" OR "you build ships" OR "we build ships" OR "they build ships" OR "I build boats" OR "you build boats" OR "we build boats" OR "they build boats" OR "I build canoes" OR "you build canoes" OR "we build canoes" OR "they build canoes"

The dropdown menus for these fields contain some pre-set lists of useful words (pronouns, articles, modal verbs). Suggestions for more pre-sets are very welcome.
There isn’t currently a limit on the number of items in your lists — but there should be! Octopus will try searching overlong strings, but the databases will impose their own limits. 

Proximity searching
Proximity searches can be performed by entering the distance (as a number) in the ‘N’ field, and a list of proximity words in the ‘Near’  field, separated by a comma and a space. So

    Keyword: build

    N: 10

    Near: ship, ships, shipyard, harbour, harbor, port

Gives

    ("build" n10 "ship") OR ("build" n10 "ships") OR ("build" n10 "shipyard") OR ("build" n10 "harbour") OR ("build" n10 "harbor") OR ("build" n10 "port")

The ‘Before’/’After’ fields can be used in combination with the proximity fields:

    Before: he, she, it

    Keyword: builds

    N: 10

    Near: ships, boats, kayaks

Gives

    ("he builds" n10 "ships") OR ("he builds" n10 "boats") OR ("he builds" n10 "kayaks") OR ("she builds" n10 "ships") OR ("she builds" n10 "boats") OR ("she builds" n10 "kayaks") OR ("it builds" n10 "ships") OR ("it builds" n10 "boats") OR ("it builds" n10 "kayaks")
  
Octopus translates the string to the proximity syntax of Google Books, Gale, Nexis, and ProQuest. Databases without proximity search just default to an ‘AND’ operator (for Twitter this is, in effect, a proximity search, given the shortness of the texts).

Combining searches
You can build up search strings with different kinds of searches and different inputs. After clicking ‘Add’ for your first set of inputs, ‘Clear’ the In section, and fill in a new one. Click ‘Add’ again, and it’ll be appended to your previous string.

Phrases
Octopus splits the inputted lists down the comma and space; this means that inputs don’t necessarily have to be single words — phrases can be used too.

ProQuest & EEBO
Octopus doesn’t link out to ProQuest and EEBO, but it does build those strings. You can ‘Copy’ those strings and paste them manually into the ProQuest interface.
Octopus’s EEBO output works slightly differently to accommodate early modern spelling variants. Quotation marks are not put around single words, which allows EEBO to search using its dataset of spelling variants of those words. Phrases are surrounded by the “{curly brackets}” which tell EEBO to search for variants of those words.

At this prototype stage, Octopus is likely to have some bugs, so please let me know. Suggestions for improvements and additions are also very welcome!

James Misson
15/07/22

