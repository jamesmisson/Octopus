// Octopus, aka OEDOneShot
// begun March 2022


//TODO:
// a bug: when do a no-dated search, then clear, then do a new dated search, the no-dated search also appears in results; also old prox stuff not clearing? perhaps now fixed by refreshing generic_string nd search_strings in add()
// seeing as we want the search links to be dynamic (update when textfield is changed), maybe they don't need to be determined in the db functions at all? Just update on textfield change? hmm but the update link function doesnt work when its only that running so seems like it only works via manual input
// make keyword search also iterable, so can enter plurals/conjunctions; tried this but wasn't working/froze up browser??
// make update function also include the dates again
// give a warning for dates out of range on certain DBs (i.e. if dates < 2007, no twitter for instance). If whole DB is out of date range, untick box
// plumb in outstanding DBs: jstor, nex, npa, hathitrust. Want to add archive?
// something weird going on when add search with no dates, then add another search with dates. dates wrong way round?? gb goes 31 of dec to 1 jan?? cant replicate it now
// some field validation/strip trailing white space from inputs?
// work out mechanism for splitting overlong search strings
// option to save the output (new section below Output block)?!
// need an undo button/function for when adding searches to string?


let before = ''
let keyword = ''
let after = ''
let prox = 0
let prox_kw = ''
let dateLower;
let dateUpper;

let ngrams = []
let search_strings = []

// var regex = / NEAR\/\d{1,2} /;
const regex = new RegExp(/ NEAR\/\d{1,2} /, 'g')

function add() {
    //clear ngrams
    ngrams = []
    // clear generic string? this might mess something up further down?
    generic_string = ''
    //clear search_strings
    search_strings = []

    //get inputs
    before = document.querySelector('#before').value;
    keyword = document.querySelector('#keyword').value;
    after = document.querySelector('#after').value;
    prox_kw = document.querySelector('#proximity-keyword').value;
    
    //check that date inputs are dates before assigning value, if one is blank make it 0000 or 2022
    //not sure if 0000 words in db URLs yet
    if (/^\d{4}$/.test(document.querySelector('#date_lower').value) && /^\d{4}$/.test(document.querySelector('#date_upper').value)) {
        dateLower = document.querySelector('#date_lower').value;
        dateUpper = document.querySelector('#date_upper').value;
        console.log('both numbers')
    } else if (/^\d{4}$/.test(document.querySelector('#date_lower').value)) {
        dateLower = document.querySelector('#date_lower').value;
        dateUpper = '2022'
    } else if (/^\d{4}$/.test(document.querySelector('#date_upper').value)) {
        dateLower = '0000'
        dateUpper = document.querySelector('#date_upper').value;
    } else {
        dateLower = '';
        dateUpper = '';
    }


    //check that prox is a 2 digit number
    if (/^\d{1,2}$/.test(document.querySelector('#proximity').value)) {
        prox = document.querySelector('#proximity').value;
    } else {
        prox = '';
    }

    //run functions on that input
    // console.log('running')
    parseInput()
    gb()
    proq()
    twi()
    gale()
    jstor()
    hathi()
    nex()
}

function parseInput() {
    // takes inputs of before, keyword, and after, combines them correctly, adds each to ngrams array
    if (before.length !== 0) {
        var beforeArray = before.split(', ');
    };
    if (after.length !== 0) {
        var afterArray = after.split(', ');
    };

    // compile arrays of ngrams depending on whether values are before, after, or before and after (this seems very heavy handed, must be an easier way!)
    if (beforeArray && afterArray) {
        for (var a = 0; a < afterArray.length; a++) {
            for (var b = 0; b < beforeArray.length; b++) {
                let ngram = beforeArray[b] + ' ' + keyword + ' ' + afterArray[a];
                ngrams.push(ngram);
            }
        }
    } else if (beforeArray) {
        for (var b = 0; b < beforeArray.length; b++) {
            let ngram = beforeArray[b] + ' ' + keyword;
            ngrams.push(ngram);
        } 
    } else if (afterArray) {
        for (var a = 0; a < afterArray.length; a++) {
            let ngram = keyword + ' ' + afterArray[a];
            ngrams.push(ngram);
        }
    } else {
        ngrams.push(keyword)
    }
    
    if (prox) {
        let  prox_kwArray = prox_kw.split(', ')
        for (let n = 0; n < ngrams.length; n++) {
            for (let p = 0; p < prox_kwArray.length; p++) {
                search_string = '("' + ngrams[n] + '" NEAR/' + prox + ' ' + '"' + prox_kwArray[p] + '")'
                search_strings.push(search_string)
                generic_string = search_strings.join(" OR ")
            }
        }
    } else {
        generic_string = '"' + ngrams.join('" OR "') + '"';
    }
    }

//functions for updating db textareas and links (the repetition between them could be wrapped up in its own function?)

function gb() {
    //replace proximity in generic string
    
    google_string = generic_string.replaceAll(regex, ' AROUND(' + prox + ') ');

    //push string to text area, or add to what's already there
    if (document.getElementById("google_result").value) {
        document.getElementById("google_result").value += ' OR ' + google_string
        google_string = document.getElementById("google_result").value
    } else {
        document.getElementById("google_result").value = google_string
        google_string = document.getElementById("google_result").value
    }
    // update link out
    if (dateLower && dateUpper) {
    document.getElementById("google_link").href = 'https://www.google.com/search?tbo=p&tbm=bks&q=' + google_string.replace(' ', '+') + '&tbs=,cdr:1,cd_min:Jan+1_2+' + dateLower + ',cd_max:Dec+31_2+' + dateUpper + '&num=100';
    } else {
        document.getElementById("google_link").href = 'https://www.google.com/search?tbo=p&tbm=bks&q=' + google_string.replace(' ', '+') + '&num=100'
    }
}

function proq() {
    // generic_string is already same as proq string
    proq_string = generic_string
    //push string to text area, or add to what's already there
    if (document.getElementById("proq_result").value) {
        document.getElementById("proq_result").value += ' OR ' + proq_string
        proq_string = document.getElementById("proq_result").value
    } else {
        document.getElementById("proq_result").value = proq_string
        proq_string = document.getElementById("proq_result").value
    }
    // update link out NB search link not there so this doesn't do anything
    // if (dateLower && dateUpper) {
    // document.getElementById("proq_link").href = 'INSERT PROQUEST URL' + proq_string.replace(' ', '+') + '&tbs=,cdr:1,cd_min:Jan+1_2+' + dateLower + ',cd_max:Dec+31_2+' + dateUpper + '&num=100';
    // } else {
    //     document.getElementById("proq_link").href = 'INSERT PROQUEST URL' + proq_string.replace(' ', '+') + '&num=100'
    // }
}

function twi() {
    //replace proximity in generic string NB TWITTER JUST MAKES IT AN 'AND' AS TWITTER DOESNT HAVE PROX, AND TWEETS ARE SHORT ANYWAY
    twi_string = generic_string.replaceAll(regex, ' AND ');

    //push string to text area, or add to what's already there
    if (document.getElementById("twi_result").value) {
        document.getElementById("twi_result").value += ' OR ' + twi_string
        twi_string = document.getElementById("twi_result").value
    } else {
        document.getElementById("twi_result").value = twi_string
        twi_string = document.getElementById("twi_result").value
    }
    // update link out
    if (dateLower && dateUpper) {
        //work out date stuff
    document.getElementById("twi_link").href = 'https://twitter.com/search?q=' + twi_string.replace(' ', '%20') + '%20until%3A' + dateUpper + '-12-31%20since%3A' + dateLower + '-01-01&src=typed_query'; 
    } else {
        document.getElementById("twi_link").href = 'https://twitter.com/search?q=' + twi_string.replace(' ', '%20') + '&src=typed_query&f=top'
    }
}

function gale() {
    //replace proximity in generic string
    
    gale_string = generic_string.replaceAll(regex, ' n' + prox + ' ');

    //push string to text area, or add to what's already there
    if (document.getElementById("gale_result").value) {
        document.getElementById("gale_result").value += ' OR ' + gale_string
        gale_string = document.getElementById("gale_result").value
    } else {
        document.getElementById("gale_result").value = gale_string
        gale_string = document.getElementById("gale_result").value
    }
    // update link out
    if (dateLower && dateUpper) {
    document.getElementById("gale_link").href = 'https://ezproxy-prd.bodleian.ox.ac.uk:2201/ps/advancedSearch.do?operators%5B999%5D=And&inputFieldValues%5B999%5D=&inputFieldNames%5B999%5D=TXT&fuzzyLevels%5BOQE%5D=HIGH&fuzzyLevels%5BTXT%5D=HIGH&inputFieldValues%5B0%5D=' + gale_string.replace(' ', '+') + '&inputFieldNames%5B0%5D=TXT&operators%5B1%5D=And&inputFieldValues%5B1%5D=&inputFieldNames%5B1%5D=TXT&operators%5B2%5D=And&inputFieldValues%5B2%5D=&inputFieldNames%5B2%5D=TXT&_fuzzyEnabled=on&limiterFieldValues%5BDB%5D=GDSC&limiterFieldValues%5BDB%5D=BNCN&limiterFieldValues%5BDB%5D=DMHA&limiterFieldValues%5BDB%5D=ECCO&limiterFieldValues%5BDB%5D=FTHA&limiterFieldValues%5BDB%5D=NCCO&limiterFieldValues%5BDB%5D=NCNP&limiterFieldValues%5BDB%5D=NCUK&limiterFieldValues%5BDB%5D=PLEX&limiterFieldValues%5BDB%5D=BBCN&limiterFieldValues%5BDB%5D=NICN&limiterFieldValues%5BDB%5D=ECON&limiterFieldValues%5BDB%5D=ILN&limiterFieldValues%5BDB%5D=MOML&limiterFieldValues%5BDB%5D=MOME&limiterFieldValues%5BDB%5D=STHA&limiterFieldValues%5BDB%5D=TGRH&limiterFieldValues%5BDB%5D=TTDA&limiterFieldValues%5BDB%5D=TLSH&limiterFieldValues%5BDB%5D=USDD&limiterTypes%5BDB%5D=OR&dateIndices=DA&dateLimiterValues%5BDA%5D.dateMode=4&dateLimiterValues%5BDA%5D.fromDay=00&dateLimiterValues%5BDA%5D.fromMonth=00&dateLimiterValues%5BDA%5D.fromYear=' + dateLower + '&dateLimiterValues%5BDA%5D.toDay=00&dateLimiterValues%5BDA%5D.toMonth=00&dateLimiterValues%5BDA%5D.toYear=' + dateUpper + '&standAloneLimiters=DA&_nonDatedLimiterValues%5BDA%5D=on&standAloneLimiters=DG&limiterTypes%5BDG%5D=OR&standAloneLimiters=TY&limiterTypes%5BTY%5D=OR&limiterFieldValues%5BPU%5D=&standAloneLimiters=PU&standAloneLimiters=GS&limiterTypes%5BGS%5D=OR&standAloneLimiters=PUB_COUNTRY&limiterTypes%5BPUB_COUNTRY%5D=OR&standAloneLimiters=PUB_STATE_COUNTRY&limiterTypes%5BPUB_STATE_COUNTRY%5D=OR&standAloneLimiters=PUB_CITY_STATE_COUNTRY&limiterTypes%5BPUB_CITY_STATE_COUNTRY%5D=OR&standAloneLimiters=LG&limiterTypes%5BLG%5D=OR&standAloneLimiters=IMG_TY&limiterTypes%5BIMG_TY%5D=OR&standAloneLimiters=SRC_INST&limiterTypes%5BSRC_INST%5D=OR&method=doSearch&noOfRows=3&searchType=AdvancedSearchForm&userGroupName=oxford&prodId=GDCS&nwf=y&searchResultsType=MultiTab';
} else {
        document.getElementById("gale_link").href = 'https://ezproxy-prd.bodleian.ox.ac.uk:2201/ps/basicSearch.do?inputFieldNames%5B0%5D=OQE&inputFieldValues%5B0%5D=' + gale_string.replace(' ', '+') + '&nwf=y&searchType=BasicSearchForm&userGroupName=oxford&prodId=GDCS&spellCheck=true&method=doSearch&dblist=&stw.option=&ebook=&dateMode%5BDA%5D=all&_nonDatedLimiterValues%5BDA%5D=on&limiterTypes%5BDB%5D=OR';
    }
}

function nex() {
    //replace proximity in generic string
    
    nex_string = generic_string.replaceAll(regex, ' near/' + prox + ' ');

    //push string to text area, or add to what's already there
    if (document.getElementById("nex_result").value) {
        document.getElementById("nex_result").value += ' OR ' + nex_string
        nex_string = document.getElementById("nex_result").value
    } else {
        document.getElementById("nex_result").value = nex_string
        nex_string = document.getElementById("nex_result").value
    }
    // update link out
    if (dateLower && dateUpper) {
    document.getElementById("nex_link").href = 'https://advance.lexis.com/search/?pdsearchtype=SearchBox&pdtypeofsearch=searchboxclick&pdstartin=&pdsearchterms=' + nex_string.replace(' ', '+') + '&pdtimeline=01%2F01%2F' + dateLower + '+to+31%2F12%2F' + dateUpper + '%7Cbetween%7CDD%2FMM%2FYYYY&pdpsf=&pdquerytemplateid=&pdsf=&ecomp=bdbhkkk&prid=be7489dc-9481-42cb-9429-8e64a7e650d1';
    } else {
        document.getElementById("nex_link").href = 'https://advance.lexis.com/search/?pdsearchtype=SearchBox&pdtypeofsearch=searchboxclick&pdstartin=&pdsearchterms=' + nex_string.replace(' ', '+');
    }
}

function jstor() {
    console.log(search_strings)
    // currently just converts proximities to ANDs, the real prox stuff needs some more attention (needs a warning system and multiple tab opening? I guess print the ("x y"~10) on separate lines?)
    jstor_string = generic_string.replaceAll(regex, ' AND ');

    //push string to text area, or add to what's already there
    if (document.getElementById("jstor_result").value) {
        document.getElementById("jstor_result").value += ' OR ' + jstor_string
        jstor_string = document.getElementById("jstor_result").value
    } else {
        document.getElementById("jstor_result").value = jstor_string
        jstor_string = document.getElementById("jstor_result").value
    }
    // update link out
    if (dateLower && dateUpper) {
        //work out date stuff
        document.getElementById("jstor_link").href = 'https://www.jstor.org/action/doAdvancedSearch?group=none&q0=' + jstor_string.replace(' ', '%20') + '&q1=&q2=&q3=&q4=&q5=&q6=&sd=' + dateLower  + '&ed=' + dateUpper + '&pt=&isbn=&f0=all&c1=AND&f1=all&c2=AND&f2=all&c3=AND&f3=all&c4=AND&f4=all&c5=AND&f5=all&c6=AND&f6=all&acc=on&la=&so=old';
    } else {
        document.getElementById("jstor_link").href = 'https://www.jstor.org/action/doAdvancedSearch?group=none&q0=' + jstor_string.replace(' ', '%20') + '&q1=&q2=&q3=&q4=&q5=&q6=&sd=&ed=&pt=&isbn=&f0=all&c1=AND&f1=all&c2=AND&f2=all&c3=AND&f3=all&c4=AND&f4=all&c5=AND&f5=all&c6=AND&f6=all&acc=on&la=&so=old'
    }
    
}

function hathi() {
    //replace proximity in generic string NB hathi JUST MAKES IT AN 'AND' AS hathi DOESNT HAVE PROX
    hathi_string = generic_string.replaceAll(regex, ' AND ');

    //push string to text area, or add to what's already there
    if (document.getElementById("hathi_result").value) {
        document.getElementById("hathi_result").value += ' OR ' + hathi_string
        hathi_string = document.getElementById("hathi_result").value
    } else {
        document.getElementById("hathi_result").value = hathi_string
        hathi_string = document.getElementById("hathi_result").value
    }
    // update link out
    if (dateLower && dateUpper) {
        //work out date stuff
    document.getElementById("hathi_link").href = 'https://babel.hathitrust.org/cgi/ls?a=srchls&q1=' + hathi_string.replace(' ', '+') + '&field1=ocr&anyall1=all&yop=between&pdate_start=' + dateLower + '&pdate_end=' + dateUpper;
        } else {
            document.getElementById("hathi_link").href = 'https://babel.hathitrust.org/cgi/ls?a=srchls&q1=' + hathi_string.replace(' ', '+') + '&field1=ocr&anyall1=all&yop=after';
        }
}


//other functions

function searchSelected() {
    console.log('searching selected')
    //NB popups need to be allowed in Chrome
    var checkboxIDs = ['gb-checkbox', 'twi-checkbox', 'gale-checkbox', 'hathi-checkbox', 'jstor-checkbox', 'nex-checkbox']
    var locs = [document.getElementById("google_link").href, document.getElementById("twi_link").href, document.getElementById("gale_link").href, document.getElementById("hathi_link").href, document.getElementById("jstor_link").href, document.getElementById("nex_link").href]
    
    for (let i = 0; i < checkboxIDs.length; i++) {
        if (document.getElementById(checkboxIDs[i]).checked) {
            window.open(locs[i])
        }
    }
};


function update_link(elementId) {
    //NB DOESNT CURRENTLY UPDATE DATES TOO!
    //update the link to GB if the gb field is edited
    let new_input = document.getElementById(elementId).value
    document.getElementById("google_link").href = 'https://www.google.com/search?tbo=p&tbm=bks&q=' + new_input.replace(' ', '+') + '&num=100';
}

function copystring(elementId) {
    //copy text to clipboard
    var copyText = document.getElementById(elementId)
    navigator.clipboard.writeText(copyText.value)
}

function clearResults() {
    ngrams=[]
    document.getElementById("proq_result").value = ''
    document.getElementById("google_result").value = ''
    document.getElementById("twi_result").value = ''
    document.getElementById("gale_result").value = ''
    document.getElementById("jstor_result").value = ''
    document.getElementById("hathi_result").value = ''
    document.getElementById("nex_result").value = ''
}


// set eventlistener for content is loaded, and only then do the convert function when form is submitted
document.addEventListener('DOMContentLoaded',  function(){
    document.querySelector('form').addEventListener('submit', add);
});



