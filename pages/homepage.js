let Categories = {
    RESUMO: 1,
    POLITICA: 2,
    ATRACOES: 3,
    OBITUARIO: 4,
    INAUGURACOES: 5,
    ESTATISTICAS: 6
}

let jsonContent = {}
let selectedYear = 1870
let selectedCategory = Categories.RESUMO

function loadfile() {
    fetch("./content.json")
	.then(res => res.json())
	.then(json => jsonContent = json)
}

function loadYear(year) {
    selectedYear = year
}

function loadCategory(category, event) {
    selectedCategory = category
    toggleClass('#sidebar-info', 'sidebar-info-expanded')
    console.log(event)
}

function toggleClass(selector, classname) {
    document.querySelector(selector).classList.toggle(classname);
}

loadfile()
