
        var numFind = document.getElementById('numFind');
        var numFindPerPage = document.getElementById('numFindPerPage');
		var globalPaginaAtual = 1;
		var globalNumeroPaginas = 0;
		var globalZoom = 100;
        var pesquisa = "";
		var pdf = '../files/hyu/'+document.getElementById('gtkja').value;
		var widthViewPortIniti = 1.5;
		var widthViewPort = 1.5;
		var resolution = 1;
		var isTwo =false;
		var isOdd = false;
		var isCont = false;
		var myCanvas = document.getElementById('my_canvas');
		var myCanvas2 = document.getElementById('my_canvas2');
		var pageOne = 	document.getElementById('pageOne');
		var highlight = false;
		var canvasDiv = document.getElementById('canvasDiv');
		var context = myCanvas.getContext("2d");
		var context2 = myCanvas2.getContext("2d");
		var zoomText = document.getElementById('zoom');
		var btnAltoContraste = document.getElementById('btnAltoContraste');
		var btnTwoPags = document.getElementById('btnTwoPags');
		var btnPassPag = document.getElementById('btnPassPag');
		var btnRetPag = document.getElementById('btnRetPag');
		var btnMoreZoom = document.getElementById('btnMoreZoom');
		var btnLessZoom = document.getElementById('btnLessZoom');
		var divPaginas = document.getElementById('divPaginas');
		var selector = document.getElementById('selector');
        var arrayPagesFindExternal = [];
        var actualPageFind = 0;
        var prontobtn1= false;
        var prontobtn2 = false;

		//carrega a primeira pagina e variaveis
		desabilitarBotoes();
		pdfjsLib.getDocument(pdf).promise.then(doc =>{

			globalNumeroPaginas = doc._pdfInfo.numPages;
			carregarDropDown();
			var numeroPaginas = document.getElementById('numeroPaginas');
			numeroPaginas.innerHTML = doc._pdfInfo.numPages;
			
			doc.getPage(globalPaginaAtual).then(page => {
				
				var viewport = page.getViewport({scale: widthViewPort});
				myCanvas.width = resolution*viewport.width;
				myCanvas.height = resolution*viewport.height;
				myCanvas.style.height = viewport.height+'px';
        		myCanvas.style.width = viewport.width+'px';
        		pageOne.style.height = viewport.height+'px';
        		pageOne.style.width = viewport.width+'px'; 
        		context.scale(resolution, resolution);
				page.render({
					canvasContext: context,
					viewport: viewport,
					
				});
				
				
				
				textLayer = document.getElementById('textLayer');
               	textLayer.style.width = viewport.width+'px';
                textLayer.style.height = viewport.height+'px'; 
				page.getTextContent().then(textContent => {
            	  	const divs = [];
            	  	pdfjsLib.renderTextLayer({
            	    	textContent: textContent,
            	    	container: textLayer,
            	    	viewport: viewport,
            	    	textDivs: [],
            	  	});
            	  	
            
            	});
				
				var paginaAtual = document.getElementById('paginaAtual');
				paginaAtual.innerHTML = globalPaginaAtual;
				habilitarBotoes();
			});	
		});
		
		//fim do carregamento





		function carregarPaginaPrincipal(){	
			desabilitarBotoes();
			prontobtn1 = false;
			pdfjsLib.getDocument(pdf).promise.then(doc =>{
				doc.getPage(globalPaginaAtual).then(async page => {
					var viewport = page.getViewport({scale: widthViewPort});
        			myCanvas.width = resolution*viewport.width;
        			myCanvas.height = resolution*viewport.height;
        			myCanvas.style.height = viewport.height+'px';
                	myCanvas.style.width = viewport.width+'px';
                	pageOne.style.height = viewport.height+'px';
                	pageOne.style.width = viewport.width+'px'; 
                	context.scale(resolution, resolution);
        			page.render({
        				canvasContext: context,
        				viewport: viewport,
        			});
        			textLayer = document.getElementById('textLayer');
                    textLayer.style.width = viewport.width+'px';
                    textLayer.style.height = viewport.height+'px'; 
                    if(highlight == false){
            			page.getTextContent().then(textContent => {
            			    prontobtn1 = true;
            			    habilitarBotoes();
            				textLayer.innerHTML = "";
                        	const divs = [];
                        	pdfjsLib.renderTextLayer({
                        	    textContent: textContent,
                        	    container: textLayer,
                        	    viewport: viewport,
                        	    textDivs: [],
                        	});
                        });
                    }else{
                        var ocorrenciasPast = await getPassOcorrencias(globalPaginaAtual);
                     
                        
                        page.getTextContent().then(async textContent => {
                            prontobtn1 = true;
                            habilitarBotoes();
                            textLayer.innerHTML = "";
                    	  	const render = await pdfjsLib.renderTextLayer({
                    	    	textContent: textContent,
                    	    	container: textLayer,
                    	    	viewport: viewport,
                    	    	textDivs: [],
                    	  	});
                    	  	findInPage();
                    	  	function findInPage(){
                    	  		var span = textLayer.querySelectorAll('span');
                    			for (var i = 0; i < textContent.items.length; i++) {
                    				if(textContent.items[i].str == ""){
                    				textContent.items.splice(i, 1);
                    				}
                    			}
                    	  		for (var i = 0; i < textContent.items.length; i++) {
                    				var item = textContent.items[i];
                    				var final = item.str;  
                    				if(item.str.indexOf(pesquisa) != -1){
                    				    
                    				    numFindPerPage.innerHTML = ocorrenciasPast;
                    					 final = final.replaceAll(pesquisa, "<span class='highlight selected appended'>"+pesquisa+"</span>");
                    				}
                    				span[i].innerHTML = final;
                    		  	}
                    		}
                    	});
                    }
        			var paginaAtual = document.getElementById('paginaAtual');
        			paginaAtual.innerHTML = globalPaginaAtual;
        			
				});
			});
		}
		function carregarPaginaSecundaria(){
		    prontobtn2 = false;
			myCanvas2.style.display = 'block';
			if ((globalPaginaAtual+1) <= globalNumeroPaginas){
				pdfjsLib.getDocument(pdf).promise.then(doc =>{
					doc.getPage(globalPaginaAtual+1).then(page => {
						var viewport = page.getViewport({scale: widthViewPort});
        				myCanvas2.width = resolution*viewport.width;
        				myCanvas2.height = resolution*viewport.height;
        				myCanvas2.style.height = viewport.height+'px';
                		myCanvas2.style.width = viewport.width+'px';
                		pageTwo.style.height = viewport.height+'px';
                		pageTwo.style.width = viewport.width+'px'; 
                		context2.scale(resolution, resolution);
        				page.render({
        					canvasContext: context2,
        					viewport: viewport,
        					
        			    });
            			textLayer2 = document.getElementById('textLayer2');
                        textLayer2.style.width = viewport.width+'px';
                        textLayer2.style.height = viewport.height+'px'; 
            			if(highlight == false){
                			page.getTextContent().then(textContent => {
                			    prontobtn2 = true;
                			    habilitarBotoes();
                				textLayer2.innerHTML = "";
                            	  const divs = [];
                            	  pdfjsLib.renderTextLayer({
                            	    textContent: textContent,
                            	    container: textLayer2,
                            	    viewport: viewport,
                            	    textDivs: [],
                            	  });
                            });
                        }else{
                            page.getTextContent().then(async textContent => {
                                prontobtn2 = true;
                                habilitarBotoes();
                                textLayer2.innerHTML = "";
                            	const render = await pdfjsLib.renderTextLayer({
                            	    textContent: textContent,
                            	    container: textLayer2,
                            	    viewport: viewport,
                            	    textDivs: [],
                            	 });
                                findInPage();
                                function findInPage(){
                                    var span = textLayer2.querySelectorAll('span');
                                
                                	for (var i = 0; i < textContent.items.length; i++) {
                                		if(textContent.items[i].str == ""){
                                		    textContent.items.splice(i, 1);
                                		}
                                	}
                                	for (var i = 0; i < textContent.items.length; i++) {
                                	    var item = textContent.items[i];
                                		var final = item.str;  
                                		if(item.str.indexOf(pesquisa) != -1){
                                		    final = final.replaceAll(pesquisa, "<span class='highlight selected appended'>"+pesquisa+"</span>");
                                		}
                                		span[i].innerHTML = final;
                                	}
                                }
                            });
                        }
        			    var paginaAtual = document.getElementById('paginaAtual');
        			    document.getElementById('paginaIsTwo').innerHTML = " e "+(globalPaginaAtual+1);
        			    
					});
			    });
		    }
		}
		
		
		
		function desabilitarBotoes(){
		    if(isTwo == false){
		        $("#pageOne").hide();
		    }else{
		        $("#pageOne").hide();
		        $("#pageTwo").hide();
		    }
		     $("#loader").show();
	
			var btn = document.getElementsByClassName('btn');
			for (var i = 0; i < btn.length; i++) {
				btn[i].disabled = true;
			}
		}
		function habilitarBotoes(){
		    if(isTwo==false){
		         
		        $("#loader").hide();
		        $("#pageOne").show();
		        var btn = document.getElementsByClassName('btn');
    			for (var i = 0; i < btn.length; i++) {
    				btn[i].disabled = false;
    			}
		    }
		    if(isTwo==true && prontobtn1 == true && prontobtn2 ==true){
		        $("#loader").hide();
		        $("#pageOne").show();
		        $("#pageTwo").show();
    			var btn = document.getElementsByClassName('btn');
    			for (var i = 0; i < btn.length; i++) {
    				btn[i].disabled = false;
    			}
		    }
		}
			


		function carregarDropDown(){
			selector.innerHTML = '';
			for (var i = 1; i <= globalNumeroPaginas; i++) {
				selector.innerHTML += "<option id="+i+">"+i+"</option>";
				if (i == globalPaginaAtual) {
					document.getElementById(globalPaginaAtual).setAttribute('selected', 'selected');
				}
				
			}
			
		}


		function passarPagina(){
			if (isTwo==true) {
				if((globalPaginaAtual+2)<globalNumeroPaginas){
					globalPaginaAtual+=2;
					carregarPaginaPrincipal();
					carregarPaginaSecundaria();
					
					

				}else if(globalPaginaAtual == (globalNumeroPaginas-2)){
				
					globalPaginaAtual+=2;
					document.getElementById('paginaIsTwo').innerHTML = "";
					myCanvas2.style.display = 'none';
					carregarPaginaPrincipal();
				}
			}else{
				if((globalPaginaAtual+1)<=globalNumeroPaginas){
					globalPaginaAtual++;
					carregarPaginaPrincipal();
					

				}
			}
			carregarDropDown();
		}	
		function voltarPagina(){
			if (isTwo==true) {
				if((globalPaginaAtual-2)>0){
					globalPaginaAtual-=2;
					carregarPaginaPrincipal();
					carregarPaginaSecundaria();
					

				}else{
					globalPaginaAtual--;
					carregarPaginaPrincipal();
					carregarPaginaSecundaria();
				}
			}else{
				if((globalPaginaAtual-1)>0){
					globalPaginaAtual--;
					carregarPaginaPrincipal();
					

				}
			}
			carregarDropDown();
			
		}

		function aumentarZoom(){
			
			if(widthViewPort<3.5){
			
					widthViewPort += 0.25;
					globalZoom += 25;
					zoomText.innerHTML = globalZoom+"%";
					carregarPaginaPrincipal();
					if (isTwo==true) {
						carregarPaginaSecundaria();
					}
			}
		}	

		function diminuirZoom(){
			
			if(widthViewPort>1){
				widthViewPort -= 0.25;
				globalZoom -= 25;
				zoomText.innerHTML = globalZoom+"%";
				carregarPaginaPrincipal();
				if (isTwo==true) {
						carregarPaginaSecundaria();
					}
					
			}
		}	

		function twoPags(){
			if (isTwo == false) {
				isTwo = true;
				widthViewPort = 1;
				globalZoom = 50;
				zoomText.innerHTML = globalZoom+"%";
				
				btnTwoPags.classList.add('active');
				btnTwoPags.setAttribute('data-title','Desativar duas páginas');
				document.getElementsByClassName('pdf')[0].scroll(50, 100);

				carregarPaginaPrincipal();

				if (globalPaginaAtual+1 <= globalNumeroPaginas) {
					carregarPaginaSecundaria();
				}
			}else{
				isTwo = false;
				widthViewPort = 1;
				globalZoom = 50;
				zoomText.innerHTML = globalZoom+"%";
				pageTwo.style.display = 'none';
				document.getElementById('paginaIsTwo').innerHTML = "";
				btnTwoPags.classList.remove('active');
				btnTwoPags.setAttribute('data-title','Ativar duas páginas');
				carregarPaginaPrincipal();
			}
			carregarDropDown();
		}
		selector.addEventListener('change', carregarPagComboBox);

		function carregarPagComboBox(){
			globalPaginaSelecionada=selector.selectedIndex+1;
			if (isTwo==true) {
				if((globalPaginaSelecionada+1)<globalNumeroPaginas){
					globalPaginaAtual=selector.selectedIndex+1;
					carregarPaginaPrincipal();
					carregarPaginaSecundaria();
				}else{
					globalPaginaAtual=selector.selectedIndex+1;
					document.getElementById('paginaIsTwo').innerHTML = "";
					myCanvas2.style.display = 'none';
					carregarPaginaPrincipal();
				}
			}else{
				carregarPaginaPrincipal();
				globalPaginaAtual=selector.selectedIndex+1;	
			}
			carregarDropDown();	
		}
		function ativarAltoContraste(){
			if(isCont==false){
				document.getElementById('body').style.filter = 'invert(100%)';
				btnAltoContraste.classList.add('active');
				btnAltoContraste.setAttribute('data-title','Desativar Alto Contraste');
				isCont = true;
			}else{
				document.getElementById('body').style.filter= 'inherit';
				btnAltoContraste.classList.remove('active');
				btnAltoContraste.setAttribute('data-title','Ativar Alto Contraste');
				isCont=false;
			}
		}


		function imprimir(pdf){
		 
			desabilitarBotoes();
			printPdf('../files/hyu/'+pdf+'print.pdf');
		    setTimeout(habilitarBotoes, 6000);
		}
		printPdf = function (url) {
		  var iframe = this._printIframe;
		  if (!this._printIframe) {
		    iframe = this._printIframe = document.createElement('iframe');
		    document.body.appendChild(iframe);

		    iframe.style.display = 'none';
		    iframe.onload = function() {
		      setTimeout(function() {
		        iframe.focus();
		        iframe.contentWindow.print();
		      }, 1);
		    };
		  }

		  iframe.src = url;
		}
		
        async function findController(){
            pesquisa = document.getElementById('find').value;
            
            if(pesquisa == ""){
                highlight = false;
                carregarPaginaPrincipal();
                numFind.innerHTML = 0;
                numFindPerPage.innerHTML = 0;
                if(isTwo == true){
                    carregarPaginaSecundaria();
                }
            }else{
                desabilitarBotoes();
                const arrayPagesContent = await getPagesFind();
              
                var arrayPagesFind = [];
                var ocorrencias = 0;
                for(var i = 0; i < globalNumeroPaginas; i++){
                    for(var b = 0; b < arrayPagesContent[i].textContent.items.length; b++){
                        if(arrayPagesContent[i].textContent.items[b].str.includes(pesquisa)){
                            let re = new RegExp(pesquisa,"g");
                            ocorrencias += (arrayPagesContent[i].textContent.items[b].str.match(re) || []).length;
                            numFind.innerHTML = ocorrencias;
                            if(arrayPagesFind.indexOf(i+1) == -1){
                                arrayPagesFind.push(i+1);
                            }
                            
                        }
                        
                    }
                }
               
              
                if(arrayPagesFind.length>0){
                    highlight = true;
                    arrayPagesFindExternal = arrayPagesFind;
                    globalPaginaAtual = arrayPagesFind[0];
                    carregarPaginaPrincipal();
                    if(isTwo == true){
                        carregarPaginaSecundaria();
                    }
                }
            }
        }
        
        
        
        
        async function getPagesFind(){
            var arrayPagesContent = [];
          
            const loadingTask = pdfjsLib.getDocument(pdf);
            var array = await (async () => {
                
                
                const pdf = await loadingTask.promise;
                  for(var i = 1; i <= globalNumeroPaginas; i++){
                      const ind = i;
                      const page = await pdf.getPage(i);
                      const textContentElement = await page.getTextContent().then(textContent => {
                            const textContentPage = {
                              textContent: textContent,
                              page: ind
                            };
                            return textContentPage;
                      });
                      
                      arrayPagesContent.push(textContentElement);
                      if(arrayPagesContent.length == globalNumeroPaginas){
                          
                        return arrayPagesContent;
                      }
                      
                  }
                  
                  
                        
            })();
            return array;
        }
        
        
        async function getPassOcorrencias(page){
         
                const arrayPagesContent = await getPagesFind();
                let re = new RegExp(pesquisa,"g");
                arrayPagesFind = [];
                var ocorrencias = 0;
                for(var i = 0; i < page; i++){
                    for(var b = 0; b < arrayPagesContent[i].textContent.items.length; b++){
                        if(arrayPagesContent[i].textContent.items[b].str.includes(pesquisa)){
                            
                            ocorrencias += (arrayPagesContent[i].textContent.items[b].str.match(re) || []).length;
    
                            
                        }
                        
                    }
                }
                return ocorrencias;
              
                
        }
         function proxPageFind(){
            
            if(arrayPagesFindExternal.length > 1){
              if(arrayPagesFindExternal.length-1 > actualPageFind){
                 actualPageFind++;
                 globalPaginaAtual = arrayPagesFindExternal[actualPageFind];
                 carregarPaginaPrincipal();
                 if(isTwo==true){
                     carregarPaginaSecundaria();
                 }
             }else{
                 actualPageFind= 0;
                 globalPaginaAtual = arrayPagesFindExternal[actualPageFind];
                 carregarPaginaPrincipal();
                 if(isTwo==true){
                     carregarPaginaSecundaria();
                 }
             }  
            }
          
         }
        function voltarPageFind(){
            if(arrayPagesFindExternal.length > 1){
                if(actualPageFind > 0){
                 actualPageFind--;
                 globalPaginaAtual = arrayPagesFindExternal[actualPageFind];
                 carregarPaginaPrincipal();
                 if(isTwo==true){
                     carregarPaginaSecundaria();
                 }
             }else{
                 actualPageFind = arrayPagesFindExternal.length-1;
                 globalPaginaAtual = arrayPagesFindExternal[actualPageFind];
                 carregarPaginaPrincipal();
                 if(isTwo==true){
                     carregarPaginaSecundaria();
                 }
             } 
            } 
          
         }
        
       
		