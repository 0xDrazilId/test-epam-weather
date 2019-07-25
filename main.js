monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
dayOfWeeks = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение', ]

function initialization() {
  getResult(GLOBAL_I);  
}

function next() {			/* Срабатывает при нажатии на кнопку "Вперед" */
  if(GLOBAL_I < weatherList.length && GLOBAL_I >= 0 && weatherList[GLOBAL_I+3]){  
    GLOBAL_I++; 			/* Если глобальная переменная входит в рамки массива и -3 элемента */
    getResult(GLOBAL_I);  	/* выполнится основная функция, если вручную вписать global_i - код не выполнится, страница не зависнет */
  }
}

function previous() {		/* Срабатывает при нажатии на кнопку "Вперед" */
  if(GLOBAL_I < weatherList.length && GLOBAL_I-1 >= 0 && GLOBAL_I >= 0 && weatherList[GLOBAL_I-1]){
    GLOBAL_I--;
    getResult(GLOBAL_I);
  }
}

function precip(rain, snow){/* Функция для удобного отображения осадков */
  if(rain && snow)  return "Дождь со снегом"
  if(rain && !snow)   return "Дождь"
  if(!rain && snow)   return "Снег"
  if(!rain && !snow)  return "Без осадков"
  // maybe I could have done it in a simpler and more elegant way, but idk how :(
}

function checkDate(dayOfNow, targetDay){  /* функция проверки даты для отсечения прошлых дней */
    if (dayOfNow.getMonth() == targetDay.getMonth()) {  //если месяц равен текущему
      if (dayOfNow.getDate() <= targetDay.getDate()) { //и сегодня меньше чем таргет дата
        return true;
      }     
      else {return false;} //если таргет дата < сегодня (то есть таргет = вчера или позавчера или ... то false)
    }
    if(dayOfNow.getMonth() < targetDay.getMonth()){ //если текущий месяц < чем таргет дата (будущее)
        return true;
      }
    else {alert('month is ok'); return false;} // если сегодняшний месяц больше чем месяц таргет даты
    /* Можно также добавить проверку на data.getFullYear (Опционально, смотря какое кол-во данных) */
  }

function getResult(i){ //i - с какого элемента начинать показ дней, передаётся глобальной переменной GLOBAL_I, 
						//	т.к. для функции inizialization, запускающейся при загрузке страницы, нужна переменная из самого начала документа
  var size = weatherList.length;
  var result = new Array(size);
  for (var j = 0; j < size; j++) { 
    var dateOfWeather = new Date(weatherList[j].date); //j = номер итерации, i = относительный номер элемента
    var today = new Date();		// сегодняшняя дата в UTC формате
    if(checkDate(today, dateOfWeather)){  //если дата прошла проверку
	    var parseDate = dateOfWeather.getDate() + " " + monthNames[dateOfWeather.getMonth()];   
	    var dayOfWeek = dayOfWeeks[dateOfWeather.getDay()];
	    result[j] = '<div class = "weatherBlock"><div class = "dayOfWeek">' + dayOfWeek + '</div><h1>' + parseDate + '</h1><img src = img/' + (weatherList[j].cloudiness.toLowerCase() + " " + (precip(weatherList[j].rain, weatherList[j].snow)).toLowerCase()).split(" ").join("")  + '.png></h1><br>' + '<div class="dayTemperature"> Днём: ' + weatherList[j].temperature.day + '°C</div><div class = "nightTemperature">Ночью: ' + weatherList[j].temperature.night + '°C</div><br><div class = "precipitations">' + weatherList[j].cloudiness + ", " + precip(weatherList[j].rain, weatherList[j].snow) +  '</div></div>';
    }
    else { result[j] = 'f '; }; 
    /* если дата не прошла проверку, заполняем массив маяком, который удалим в будущем 
	(пробовал оставить пустые скобки, страница либо зависала, либо не переключалась на кнопки) */
  } //end of for
  	for (var j1 = 0; j1 < size; j1++) {  //цикл для удаления не прошедших на проверку даты элементов
  		if(result[j1] == 'f ') {	//удаляем тот самый маяк из строчки 56
        	result.splice(j1, 1);
        	j1--; //после splice индекс итераций смещается
    	}
  	}
  //заполняем mainBlock данными из результирующего массива	
  document.getElementById('mainBlock').innerHTML = '<center><h2>Прогноз погоды</h2></center><div id = "prev" onmouseover=\"this.style.width = 60px\" onclick="previous()"></div>' + result.slice(i,i+4).join("") + '<div id = "next" onclick="next()"></div>';
  if ((i-1) < 0) { document.getElementById('prev').style.opacity = 0.3; }  //если элемент первый, применяем стиль к кнопке "назад"
  if (i >= (weatherList.length - 4)) { document.getElementById('next').style.opacity = 0.3; } /* если последний - к кнопке вперед */
}
