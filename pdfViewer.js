
		var globalPaginaAtual = 1;
		var globalNumeroPaginas = 0;
		var globalZoom = 100;




		var pdf = 'pdf/test.pdf';
		var widthViewPortIniti = 1.5;
		var widthViewPort = 1.5;
		var resolution = 2;
		var isTwo =false;
		var isOdd = false;
		var isCont = false;
		var myCanvas = document.getElementById('my_canvas');
		var myCanvas2 = document.getElementById('my_canvas2');
			
			
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
        		context.scale(resolution, resolution);
				page.render({
					canvasContext: context,
					viewport: viewport,
					
				});
				var paginaAtual = document.getElementById('paginaAtual');
				paginaAtual.innerHTML = globalPaginaAtual;
				habilitarBotoes();
			});	
		});
		
		//fim do carregamento





		function carregarPaginaPrincipal(){	
				desabilitarBotoes();				
				pdfjsLib.getDocument(pdf).promise.then(doc =>{
	
					doc.getPage(globalPaginaAtual).then(page => {
						

						var viewport = page.getViewport({scale: widthViewPort});
						myCanvas.width = resolution*viewport.width;
						myCanvas.height = resolution*viewport.height;
						myCanvas.style.height = viewport.height+'px'; 
		        		myCanvas.style.width = viewport.width+'px';
		        		context.scale(resolution, resolution);

						page.render({
							canvasContext: context,
							viewport: viewport
						});

						var paginaAtual = document.getElementById('paginaAtual');
						paginaAtual.innerHTML = globalPaginaAtual;
						habilitarBotoes();
					});
		
		
				});
			}
		function carregarPaginaSecundaria(){
			
			document.getElementsByClassName('pdf')[0].style.justifyContent = 'inherit';
			myCanvas2.style.display = 'block';
			if ((globalPaginaAtual+1) <= globalNumeroPaginas){

				pdfjsLib.getDocument(pdf).promise.then(doc =>{
					doc.getPage(globalPaginaAtual+1).then(page => {
						
						var viewport = page.getViewport({scale: widthViewPort});
						myCanvas2.width = resolution*viewport.width;
						myCanvas2.height = resolution*viewport.height;
						myCanvas2.style.height = viewport.height+'px'; 
		        		myCanvas2.style.width = viewport.width+'px';
		        		context2.scale(resolution, resolution);
						page.render({
							canvasContext: context2,
							viewport: viewport,
							
						});
						var paginaAtual = document.getElementById('paginaAtual');
						document.getElementById('paginaIsTwo').innerHTML = " e "+(globalPaginaAtual+1);
						habilitarBotoes();
					});
					
				});
			}
		}

		function desabilitarBotoes(){
			var btn = document.getElementsByClassName('btn');
			for (var i = 0; i < btn.length; i++) {
				btn[i].disabled = true;
			}
		}
		function habilitarBotoes(){
			var btn = document.getElementsByClassName('btn');
			for (var i = 0; i < btn.length; i++) {
				btn[i].disabled = false;
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
				myCanvas2.style.display = 'none';
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
			printPdf(pdf);
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

		