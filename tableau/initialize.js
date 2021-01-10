// 
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//Function to initialize the vizualizations 
//Uses the sleep helper function to make sure that all the vizualizations are loaded before the rest of the program can continue
export async function initialize_function(url, div)
{
    var testtimer = 0;
    var containerDiv = document.getElementById(div),
    options = {
        //hideTabs: true,
        onFirstInteractive: () => {testtimer = 1}
    }
    var result =  new tableau.Viz(containerDiv, url, options)

    while (testtimer == 0){
        await sleep(50)
    }
    
    return result
}