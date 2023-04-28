var sourceSelect = "vipbsn";
var modeSelect = "0";
var localPostUrl = "http://localhost/qbook/api/create.php";
var postUrl = "https://tukulab.com/qbook/api/create.php";

chrome.storage.local.get(
  ["enabled", "sourceSelect", "modeSelect", "manualMode"],
  (data) => {
    console.log(data);
    if (data.sourceSelect) {
      sourceSelect = data.sourceSelect;
    }
    if (data.modeSelect) {
      modeSelect = data.modeSelect;
    }
    if (data.enabled || data.manualMode) {
      //it is enabled, do accordingly
      setTimeout(function () {
        if (sourceSelect == "vipbsn") {
          var chapter = document.getElementsByClassName("webkit-chapter")[0];
          console.log("chapter " + chapter);
          var title = document.getElementsByClassName("chapter-title")[0];
          console.log(title.innerText);
          console.log("title " + title);
          var book = getElementByXpath(
            "//*[@id='box-chapter-content']/div/div[2]/div[1]/div/div/nav/ol/li[3]/a"
          );
          console.log("book " + book.innerText);
          var bookAuthor = getElementByXpath(
            '//*[@id="id_chap_content"]/ul/li[2]/p'
          ).innerText;
          console.log("bookAuthor " + bookAuthor);
          var btnBuyChapter = document.getElementsByClassName("btn-buy")[0];
          if (btnBuyChapter) {
            console.log("chưa mua chương");
          } else {
            if (chapter && title && book && !btnBuyChapter) {
              var bookName = book.innerText;
              var titleText = title.innerText;
              var chapterText = chapter.innerHTML;
              var chapterNo = parseInt(textbetween(titleText, "Chương", ":"));
              insertTexttoDb(
                titleText,
                chapterText,
                chapterNo,
                bookName,
                modeSelect,
                bookAuthor
              );
            }
          }
        }
      }, 3000);
    } else {
      //it is disabled
    }
  }
);

function insertTexttoDb(
  titleText,
  chapterText,
  chapterNo,
  bookName,
  modeSelect,
  bookAuthor
) {
  postData(postUrl, {
    chapter_title: titleText,
    chapter_content: chapterText,
    chapter_no: chapterNo,
    book_name: bookName,
    book_author: bookAuthor,
  }).then((data) => {
    console.log(data.status);
    if (data.status == 200) {
      //  trigger next button
      if (modeSelect == 1) {
        let x = getElementByXpath(
          "//*[@id='box-chapter-content']/div/div[2]/div[1]/div/div/div[2]/div[1]/div[2]/a"
        );
        x.click();
      }
    }
  });
}

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function textbetween(s, prefix, suffix) {
  var i = s.indexOf(prefix);
  if (i >= 0) {
    s = s.substring(i + prefix.length);
  } else {
    return "";
  }
  if (suffix) {
    i = s.indexOf(suffix);
    if (i >= 0) {
      s = s.substring(0, i);
    } else {
      return "";
    }
  }
  return s;
}
