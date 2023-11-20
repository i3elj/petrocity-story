let Categories = {
    RESUMO: 1,
    POLITICA: 2,
    ATRACOES: 3,
    OBITUARIO: 4,
    INAUGURACOES: 5,
    ESTATISTICAS: 6
}

function createCategory(categoryString)
{
    switch (categoryString) {
    case "resumo": return Categories.RESUMO; break;
    case "politica": return Categories.POLITICA; break;
    case "atracoes": return Categories.ATRACOES; break;
    case "obituario": return Categories.OBITUARIO; break;
    case "inauguracoes": return Categories.INAUGURACOES; break;
    case "estatisticas": return Categories.ESTATISTICAS; break;
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
    // ui
    uiType: UITypes.TEXT,
    infoContainer: document.querySelector('#sidebar-info'),
    closeBtn: null,
    sidebarMenuOpen: 0,
    sidebarInfoOpen: 0
}

// content
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
    case Categories.RESUMO: state.categoryContent = await state.yearContent.resumo; break;
    case Categories.POLITICA: state.categoryContent = await state.yearContent.politica; break;
    case Categories.ATRACOES: state.categoryContent = await state.yearContent.atracoes; break;
    case Categories.OBITUARIO: state.categoryContent = await state.yearContent.obituario; break;
    case Categories.INAUGURACOES: state.categoryContent = await state.yearContent.inauguracoes; break;
    case Categories.ESTATISTICAS: state.categoryContent = await state.yearContent.estatisticas; break;
    }
}

// ui
function buildUI(state)
{
    switch (state.uiType) {
    case UITypes.TEXT:
	let title = document.createElement('h2')
	title.textContent = `Resumo do ano de ${state.selectedYear}`

	let resumoWrapper = document.createElement('div')
	resumoWrapper.setAttribute('id', 'sidebar-info-content')
	let resumo = document.createElement('p')
	resumo.textContent = state.yearContent.resumo.content
	resumoWrapper.appendChild(resumo)

	state.infoContainer.appendChild(state.closeBtn)
	state.infoContainer.appendChild(title)
	state.infoContainer.appendChild(resumoWrapper)
	break
    case UITypes.BULLETPOINTS:
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

// cleanUI(ProgramState)
createCloseBtn(ProgramState)

// event listeners
// menu button event listener
document.querySelector("#sidebar-btn")
    .addEventListener('click', () => toggleSidebar())

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
	let selectedCategory = createCategory(event.target.value)
	loadCategory(ProgramState, selectedCategory)

	if (ProgramState.sidebarInfoOpen)
	{
	    closeSidebarInfo()
	    setTimeout(() => cleanUI(ProgramState), 500)
	    ProgramState.sidebarInfoOpen ^= true
	}
	else
	{
	    buildUI(ProgramState)
	    openSidebarInfo()
	    ProgramState.sidebarInfoOpen ^= true
	}
    })
})

