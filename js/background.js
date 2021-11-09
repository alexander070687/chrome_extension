chrome.commands.onCommand.addListener(function (command){
  if (command === 'start') {
    chrome.tabs.executeScript({
      code: "window.getSelection().getRangeAt(0).toString();"
    }, function(selection){
      var versiculo = selection[0];

      var decoficatedVersicule = decoficarVersiculo(versiculo);

      var acronBookName = convertBook(decoficatedVersicule[0]);

      showResults(versiculo, acronBookName, decoficatedVersicule);

    });
  }
});

function showResults(versiculo, acronBookName, decoficatedVersicule){

  console.log("Versículo: " + versiculo + "\n\n" +"Libro: " + decoficatedVersicule[0] + " => " + acronBookName + "\n" + "Capítulo: " + decoficatedVersicule[1] + "\n" + "Número: " + decoficatedVersicule[2]);

  /*fetch("https://getbible.net/json?passage="+ acronBookName + "%20" + decoficatedVersicule[1] + ":" + decoficatedVersicule[2] + "&version=valera")
       .then(versicule => versicule.json())
       .then(book => console.log(book.version[0].book));*/
}

async function convertBook (book){
  let abrevBook = "";

  let response = await fetch("http://localhost:80/api/books.json")
  .then(response => response.json());

  for(var i = 0; i < response.books.length; i++){
    if(response.books[i].bookName == book){
      abrevBook = response.books[i].abrev;
      break;
    }
  }
  return abrevBook;
}

function decoficarVersiculo(versiculo){
  let selectedVersicule = versiculo;
  var book_name, chapter, verse, chapterPosition;

  book_name = selectedVersicule.split(' ')[0];
  for(var i = 0; i < selectedVersicule.length; i++){
    chapterPosition = selectedVersicule[i].match(/:/g);
    if(chapterPosition){
      chapter = selectedVersicule.substring(selectedVersicule.split(' ')[0].length+1,i);
    }
  }
  verse = selectedVersicule.split(':')[1];

  var result = []; // Crea un nuevo Array

  result[0] = book_name;
  result[1] = chapter;
  result[2] = verse;

  return result;
}
