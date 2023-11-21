class Categories {
    static RESUMO = 1;
    static POLITICA = 2;
    static ATRACOES = 3;
    static OBITUARIO = 4;
    static INAUGURACOES = 5;
    static ESTATISTICAS = 6;
    
    static categoryMap = [[ "resumo", this.RESUMO ],
			[ "politica", this.POLITICA ],
			[ "atracoes", this.ATRACOES ],
			[ "obituario", this.OBITUARIO ],
			[ "inauguracoes", this.INAUGURACOES ],
			[ "estatisticas", this.ESTATISTICA ]];

    static get(str) {
	return this.categoryMap.filter((v) => v[0] == str)[0][1]
    }
}

let UITypes = {
    TEXT: 1,
    BULLETPOINTS: 2
}

let ProgramState = {
    // stats
    selectedYear: 1870,
    selectedCategory: Categories.RESUMO,
    // content
    fileContent: [],
    yearContent: {},
    categoryContent: {},
    categoryReadableName: "Resumo",
    // ui
    uiType: UITypes.TEXT,
    infoContainer: document.querySelector('#sidebar-info'),
    closeBtn: null,
    sidebarMenuOpen: 0,
    sidebarInfoOpen: 0
}

//--- content functions ---//
async function loadFile(state, file)
{
    const res = await fetch(file)
    state.fileContent = await res.json()
}

async function loadYear(state, year)
{
    state.selectedYear = Number(year)
    state.yearContent = await state.fileContent
	.filter(v => v.ano == state.selectedYear)[0]
}

async function loadCategory(state, category)
{
    state.selectedCategory = category
    switch (state.selectedCategory) {
    case Categories.RESUMO:
	state.categoryContent = await state.yearContent.resumo
	state.uiType = UITypes.TEXT
	state.categoryReadableName = "Resumo"
	break
    case Categories.POLITICA:
	state.categoryContent = await state.yearContent.politica
	state.uiType = UITypes.BULLETPOINTS
	state.categoryReadableName = "Política"
	break
    case Categories.ATRACOES:
	state.categoryContent = await state.yearContent.atracoes
	state.uiType = UITypes.BULLETPOINTS
	state.categoryReadableName = "Atrações"
	break
    case Categories.OBITUARIO:
	state.categoryContent = await state.yearContent.obituario
	state.uiType = UITypes.BULLETPOINTS
	state.categoryReadableName = "Obituário"
	break
    case Categories.INAUGURACOES:
	state.categoryContent = await state.yearContent.inauguracoes
	state.uiType = UITypes.BULLETPOINTS
	state.categoryReadableName = "Inaugurações"
	break
    case Categories.ESTATISTICAS:
	state.categoryContent = await state.yearContent.estatisticas
	state.uiType = UITypes.BULLETPOINTS
	state.categoryReadableName = "Estatísticas"
	break
    }
}

//--- ui functions ---//
function buildUI(state)
{
    let contentContainer = document.createElement('div')
    contentContainer.setAttribute('id', 'sidebar-info-content')
    let title = document.createElement('h2')
    title.textContent = `${state.categoryReadableName} do ano de ${state.selectedYear}`
    
    switch (state.uiType) {
    case UITypes.TEXT:
	let resumo = document.createElement('p')
	resumo.textContent = state.yearContent.resumo.content
	contentContainer.appendChild(resumo)

	state.infoContainer.appendChild(state.closeBtn)
	state.infoContainer.appendChild(title)
	state.infoContainer.appendChild(contentContainer)
	break

    case UITypes.BULLETPOINTS:
	state.categoryContent.content.forEach((element, index, array) => {
	    let section = document.createElement('section')
	    let title = document.createElement('h3')
	    title.textContent = element.title
	    let ul = document.createElement('ul')

	    element.bullets.forEach(bullet => {
		let li = document.createElement('li')
		li.textContent = bullet
		ul.appendChild(li)
	    })
	    
	    section.appendChild(title)
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
	toggleClass('#sidebar-info', 'sidebar-info-expanded')
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

const toggleSidebar = () => toggleClass('#sidebar', 'sidebar-expanded')
const openSidebar = () => addClass('#sidebar', 'sidebar-expanded')
const closeSidebar = () => removeClass('#sidebar', 'sidebar-expanded')
const openSidebarInfo = () => addClass('#sidebar-info', 'sidebar-info-expanded')
const closeSidebarInfo = () => removeClass('#sidebar-info', 'sidebar-info-expanded')

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

(async function() {
    await loadFile(ProgramState, './content.json')
    await loadYear(ProgramState, 1870)
    await loadCategory(ProgramState, Categories.RESUMO)
})()

cleanUI(ProgramState)
createCloseBtn(ProgramState)

//--- event listeners ---//
// menu button event listener
document.querySelector("#sidebar-btn").addEventListener('click', () => {
    toggleSidebar()
    ProgramState.sidebarMenuOpen ^= true
})

// timeline event listeners
document.querySelectorAll(".timeline-year input").forEach((element, i, a) => {
    element.addEventListener('click', event => {
	let selectedYear = event.target.value
	loadYear(ProgramState, selectedYear)
	
	if (!ProgramState.sidebarMenuOpen) {
	    openSidebar()
	    ProgramState.sidebarMenuOpen ^= true
	}
    })
})

// sidebar event listeners
document.querySelectorAll(".sidebar-item input").forEach((element, i, a) => {
    element.addEventListener('click', event => {
	let selectedCategory = Categories.get(event.target.value)

	loadCategory(ProgramState, selectedCategory)
	    .then(() => {
		if (ProgramState.sidebarInfoOpen) {
		    closeSidebarInfo()
		    setTimeout(() => cleanUI(ProgramState), 500)
		    ProgramState.sidebarInfoOpen ^= true

		    setTimeout(() => {
			buildUI(ProgramState)
			openSidebarInfo()
			ProgramState.sidebarInfoOpen ^= true
		    }, 500)
		} else {
		    buildUI(ProgramState)
		    openSidebarInfo()
		    ProgramState.sidebarInfoOpen ^= true
		}
	    })
    })
})

