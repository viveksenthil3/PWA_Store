const activateSearch = _=>{
    $(".pwaSuggestionsListOuterContainer").addClass("activateSearch display");
    $(".pwaSuggestionsListContainer").addClass("activateSearch display");
    $("#searchInput").addClass("searchBarLeftContainerActive");
}

const deactivateSearch = _=>{
    $(".pwaSuggestionsListOuterContainer").removeClass("activateSearch display");
    $(".pwaSuggestionsListContainer").removeClass("activateSearch display");
    $("#searchInput").removeClass("searchBarLeftContainerActive");
}

$("#searchInput").on('keyup',async event=>{
    let query = $(event.target).val()
    query=query.trim()
    if(query==""){
        deactivateSearch()
        return;
    }

    const response = await $.ajax({
        url: '/getPWAs',
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        data:JSON.stringify({
            "PWAName":query
        })
    })

    activateSearch();
    $(".pwaSuggestionsListContainer").html("");

    if(response.pwas.length==0)
        $(".pwaSuggestionsListContainer").append(`
            <div class="pwaSuggestion">
                <div class="pwaSuggestionLogo"><img src="/static/image/PWA_notfound.png" alt="pwa not found"></div>
                <div class="pwaSuggestionName">No matching PWA found</div>
            </div>
        `)
    else
        response.pwas.map(pwa=>{
            $(".pwaSuggestionsListContainer").append(`
                <a href="/detailedView?PWAId=${pwa._id}">
                    <div class="pwaSuggestion">
                        <div class="pwaSuggestionLogo"><img src="${pwa.logo.url}" alt="logo"></div>
                        <div class="pwaSuggestionName">${pwa.PWAName.split(query).join(`<span class="queryPart">${query}</span>`).replace('</span> ', "</span>&nbsp;")}</div>
                    </div>
                </a>
            `)
        })
   
    
})

$(".pwaSuggestionsListOuterContainer").click(deactivateSearch);

$(document).ready(async _=>{
    // console.log("hi vivek")
     $.ajax({
        url: '/isLoggedIn',
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        }
    }).then(_=>{
        $("#loginRegisterBtn-top").hide()
        $("#logoutBtn-top").show()
    }).catch(_=>{
        $("#loginRegisterBtn-top").show()
        $("#logoutBtn-top").hide()
    })

    // console.log(response)

})

