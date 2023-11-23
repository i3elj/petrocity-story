class Categories {
    static RESUMO = 1;
    static POLITICA = 2;
    static ATRACOES = 3;
    static OBITUARIO = 4;
    static INAUGURACOES = 5;
    static PERSONALIDADES = 6;
    static VISITAS = 7;
    
    static categoryMap = [[ "resumo", this.RESUMO ],
			  [ "politica", this.POLITICA ],
			  [ "atracoes", this.ATRACOES ],
			  [ "obituario", this.OBITUARIO ],
			  [ "inauguracoes", this.INAUGURACOES ],
			  [ "personalidades", this.PERSONALIDADES ],
			  [ "visitas", this.VISITAS ]];

    static get = str => this.categoryMap.filter((v) => v[0] == str)[0][1]
}

let UITypes = {
    TEXT: 1,
    SECTIONS: 2,
    STATS: 3,
    POLITICA: 4
}

let ProgramState = {
    // stats
    selectedYear: 1870,
    selectedCategory: Categories.RESUMO,
    // content
    fileContent: [],
    yearContent: {},
    categoryContent: {},
    categoryReadableName: 'Resumo',
    // ui
    uiType: UITypes.TEXT,
    uiYear: {
	timelineItems: document.querySelectorAll('.timeline-item input'),
	scrollItems: document.querySelectorAll('.yearscroll-item input')
    },
    infoContainer: document.querySelector('#info'),
    closeBtn: null,
    menuIsOpen: 0,
    infoIsOpen: 0
}

//--- state functions ---//
function toggleMenuState(state)
{
    state.menuIsOpen ^= true
}

function toggleInfoState(state)
{
    state.infoIsOpen ^= true
}

//--- content functions ---//
function loadFile(state)
{
    state.fileContent = Content
}

function loadYear(state, year)
{
    state.selectedYear = Number(year)
    state.yearContent = state.fileContent.filter(v => v.ano == state.selectedYear)[0]
    changeUIYear(state)
}

function loadCategory(state, category)
{
    state.selectedCategory = category
    switch (state.selectedCategory) {
    case Categories.RESUMO:
	state.categoryContent = state.yearContent.resumo
	state.uiType = UITypes.TEXT
	state.categoryReadableName = "Resumo"
	break
    case Categories.POLITICA:
	state.categoryContent = state.yearContent.politica
	state.uiType = UITypes.POLITICA
	state.categoryReadableName = "Política"
	break
    case Categories.ATRACOES:
	state.categoryContent = state.yearContent.atracoes
	state.uiType = UITypes.SECTIONS
	state.categoryReadableName = "Atrações"
	break
    case Categories.OBITUARIO:
	state.categoryContent = state.yearContent.obituario
	state.uiType = UITypes.SECTIONS
	state.categoryReadableName = "Obituário"
	break
    case Categories.INAUGURACOES:
	state.categoryContent = state.yearContent.inauguracoes
	state.uiType = UITypes.SECTIONS
	state.categoryReadableName = "Inaugurações"
	break
    case Categories.PERSONALIDADES:
	state.categoryContent = state.yearContent.personalidades
	state.uiType = UITypes.SECTIONS
	state.categoryReadableName = "Personalidades"
	break
    case Categories.VISITAS:
	state.categoryContent = state.yearContent.visitas
	state.uiType = UITypes.SECTIONS
	state.categoryReadableName = "Visitas"
	break
    }
}

//--- ui functions ---//
function buildUI(state)
{
    let contentContainer = document.createElement('div')
    contentContainer.setAttribute('id', 'info-content')
    let title = document.createElement('h2')
    title.textContent = `${state.categoryReadableName} do ano de ${state.selectedYear}`
    
    switch (state.uiType) {
    case UITypes.TEXT:
	let resumo = document.createElement('p')
	resumo.innerHTML = state.yearContent.resumo.content
	contentContainer.appendChild(resumo)

	state.infoContainer.appendChild(state.closeBtn)
	state.infoContainer.appendChild(title)
	state.infoContainer.appendChild(contentContainer)
	break

    case UITypes.SECTIONS:
	state.categoryContent.content.forEach((element, index, array) => {
	    let section = document.createElement('section')
	    let title = document.createElement('h3')
	    title.textContent = element.title
	    let p = document.createElement('p')
	    p.innerHTML = element.content
	    
	    section.appendChild(title)
	    section.appendChild(p)
	    contentContainer.appendChild(section)
	})

	state.infoContainer.appendChild(state.closeBtn)
	state.infoContainer.appendChild(title)
	state.infoContainer.appendChild(contentContainer)
	break

    case UITypes.STATS:
	let section = document.createElement('section')
	let natalidade = document.createElement('h3')
	natalidade.textContent = "Natalidade: 20"
	let mortalidade = document.createElement('h3')
	mortalidade.textContent = "Mortalidade: 30"
	let criminalidade = document.createElement('h3')
	criminalidade.textContent = "Criminalidade: 10"
	let escolaridade = document.createElement('h3')
	escolaridade.textContent = "Escolaridade: 43"
	let populacao = document.createElement('h3')
	populacao.textContent = "População: 20000"

	section.appendChild(natalidade)
	section.appendChild(mortalidade)
	section.appendChild(criminalidade)
	section.appendChild(escolaridade)
	section.appendChild(populacao)
	contentContainer.appendChild(section)
	
	state.infoContainer.appendChild(state.closeBtn)
	state.infoContainer.appendChild(title)
	state.infoContainer.appendChild(contentContainer)
	break;

    case UITypes.POLITICA:
	let content = state.categoryContent.content
	content.forEach(element => {    
	    let section = document.createElement('section')
	    let ul = document.createElement('ul')
	    let sectionTitle = document.createElement('h3')
	    
	    if (element.tipo == "Vereadores")
	    {
		sectionTitle.textContent = element.tipo + " eleitos"
		element.content.forEach(vereador => {
		    let vereadorElement = document.createElement('li')
		    vereadorElement.innerText = `Vereador: ${vereador.nome}`
		    vereadorElement.innerText += `, partido: (${vereador.partido})`

		    console.log(vereador)

		    if (vereador.votos != null)
			vereadorElement.innerText += `, votos: ${vereador.votos}`
		    if (vereador.percent != null)
			vereadorElement.innerText += `, porcentagem de aceitação: ${vereador.percent}`
		    
		    ul.appendChild(vereadorElement)
		})
	    }
	    else if (element.tipo == "Prefeito")
	    {
		sectionTitle.textContent = element.tipo + " eleito"
		let prefeito = document.createElement('li')
		prefeito.textContent = `${element.content.nome} ganhou por ${element.content.votos} com ${element.content.percent} de aceitação. Seu vice foi ${element.content.vice}.`
		ul.appendChild(prefeito)
	    }
	    

	    section.appendChild(sectionTitle)
	    section.appendChild(ul)
	    contentContainer.appendChild(section)
	})

	state.infoContainer.appendChild(state.closeBtn)
	state.infoContainer.appendChild(title)
	state.infoContainer.appendChild(contentContainer)
	break
    }
}

function cleanUI(state)
{
    while (state.infoContainer.firstChild)
	state.infoContainer.removeChild(state.infoContainer.firstChild)
}

function createCloseBtn(state)
{
    state.closeBtn = document.createElement("div")
    state.closeBtn.id = "close-btn-wrapper"
    state.closeBtn.onclick = () => {
	toggleClass('#info', 'info-expanded')
	setTimeout(() => cleanUI(state), 500)
	ProgramState.sidebarInfoOpen ^= true
    }

    closeBtnSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    closeBtnSvg.setAttribute("width", "26")
    closeBtnSvg.setAttribute("height", "26")
    closeBtnSvg.setAttribute("viewBox", "0 0 26 26")
    closeBtnSvg.setAttribute("fill", "none")

    let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
    pathElement.setAttribute("d", "M1 25L25 1M25 25L1 1")
    pathElement.setAttribute("stroke", "black")
    pathElement.setAttribute("stroke-width", "2")
    pathElement.setAttribute("stroke-linecap", "round")

    closeBtnSvg.appendChild(pathElement)
    state.closeBtn.appendChild(closeBtnSvg)
}

function changeUIYear(state)
{
    const year = state.selectedYear
    state.uiYear.timelineItems.forEach(el => {
	if (el.checked && el.value != year) el.checked = false
	else if (el.value == year) el.checked = true
    })
    state.uiYear.scrollItems.forEach(el => {
	if (el.checked && el.value != year) el.checked = false
	else if (el.value == year) el.checked = true
    })
}

const toggleMenu = () => toggleClass('#menu', 'menu-expanded')
const openMenu = () => addClass('#menu', 'menu-expanded')
const closeMenu = () => removeClass('#menu', 'menu-expanded')
const openInfo = () => addClass('#info', 'info-expanded')
const closeInfo = () => removeClass('#info', 'info-expanded')
const toggleInfo = (state) =>
{
    closeInfo()
    setTimeout(() => cleanUI(state), 500)
    toggleInfoState(state)

    setTimeout(() => {
	buildUI(state)
	openInfo()
	toggleInfoState(state)
    }, 500)
}

function addClass(selector, classname)
{
    document.querySelector(selector).classList.add(classname)
}

function removeClass(selector, classname)
{
    document.querySelector(selector).classList.remove(classname)
}

function toggleClass(selector, classname)
{
    document.querySelector(selector).classList.toggle(classname)
}

loadFile(ProgramState)
loadYear(ProgramState, 1870)
loadCategory(ProgramState, Categories.RESUMO)
cleanUI(ProgramState)
createCloseBtn(ProgramState)

//--- event listeners ---//
// menu button event listener
document.querySelector("#menu-btn").addEventListener('click', () => {
    toggleMenu()
    toggleMenuState(ProgramState)
})

// timeline event listeners
document.querySelectorAll(".timeline-item input").forEach((element, i, a) => {
    element.addEventListener('click', event => {
	let selectedYear = event.target.value
	loadYear(ProgramState, selectedYear)
	
	if (!ProgramState.menuIsOpen) {
	    openMenu()
	    toggleMenuState(ProgramState)
	}
    })
})
document.querySelectorAll(".yearscroll-item input").forEach((element, i, a) => {
    element.addEventListener('click', event => {
	let selectedYear = event.target.value
	loadYear(ProgramState, selectedYear)
	loadCategory(ProgramState, ProgramState.selectedCategory)
	cleanUI(ProgramState)
	buildUI(ProgramState)
    })
})


// sidebar event listeners
document.querySelectorAll(".menu-item input").forEach((element, i, a) => {
    element.addEventListener('click', event => {
	let selectedCategory = Categories.get(event.target.value)

	loadCategory(ProgramState, selectedCategory)
	
	if (ProgramState.infoIsOpen) {
	    toggleInfo(ProgramState)
	} else {
	    cleanUI(ProgramState)
	    buildUI(ProgramState)
	    openInfo()
	    toggleInfoState(ProgramState)
	}
    })
})
