(function () {
    // !!! FOR DEVELOPMENT ONLY
//if (window.location.search.startsWith("?_ijt")) window.location.search = "";

    "use strict";

    const BASEURL = "https://api.searchspring.net/api/search/search.json?siteId=scmq7n&resultsFormat=native"
    const SITEURL = `${window.location.origin}${window.location.pathname}`
    let searchParams = new URLSearchParams(window.location.search)

    $(document).ready(function ($) {
        $(".scroll").click(function (event) {
            event.preventDefault();
            $('html,body').animate({
                scrollTop: $(this.hash).offset().top
            }, 1000);
        });

        getResults(window.location.search)
    });

// getResults function checks condition of the parameter: searchParam, to call either a default response of "New Items" or a response of searched items that gets passed into the URL as a query string
    function getResults(searchParam) {
        let searchspringAPI = {
            url: `${BASEURL}`,
            method: "GET",
            timeout: 0,
        };

        // OR statement guards against random queries that are not permitted by Searchspring and returns default results of "new items"
        if (searchParam === "" || !window.location.search.startsWith("?q")) {
            $.ajax(searchspringAPI).done(function (response) {
                response.results.forEach(function (result) {
                    renderResults(result);
                });
            });

            // else, replace the url searchParam after the ? to pass the searched query into the response
        } else {
            searchspringAPI.url = `${BASEURL}&${searchParam.substr(1)}` // "?q=pants"
            $.ajax(searchspringAPI).done(function (response) {
                $('.product-sec1').empty();
                response.results.forEach(function (result) {
                    renderResults(result);
                });
                renderPagination(response.pagination);

                // If search input is invalid, display "no results found" message
                let html = ""
                if (response.results.length === 0) {
                    html += `<div class="no-results-found">
						<span>OOPS! No results found for "${searchParam.substr(3)}!"</span>
						</div>`
                }
                $('.wrapper_top_shop').append(html);
            })
        }
    }

//Function for displaying pagination buttons is using the URLSearchParam interface to utilize the utility methods that work with the query string of the URL, and enables pagination buttons
    function renderPagination(pagination) {
        let paginationHtml = "";
        if (pagination.totalPages === 1) return "";

        //add previous button <<
        deletePageParam(searchParams)
        paginationHtml += renderPreviousIcon(searchParams, pagination);

        // In between << and >>, include page numbers with a range of 2 greater and 2 less of than current page
        let start = Math.max(1, pagination.currentPage - 2);
        let end = Math.min(pagination.currentPage + 2, pagination.totalPages);

        for (let i = start; i <= end; i++) {

            deletePageParam(searchParams)
            searchParams.append("page", i.toString());

            // if user is on current page, enable "active" attribute on page link
            let activeItemClass = pagination.currentPage === i ? "active" : "";

            paginationHtml += `<li class="page-item ${activeItemClass}"><a class="page-link" href="${SITEURL}?${searchParams.toString()}">${i}</a></li>`
        }

        // add next button >>
        deletePageParam(searchParams)
        paginationHtml += renderForwardIcon(searchParams, pagination);

        $('ul.pagination').append(paginationHtml);
    }

// Function to render << previous button only if page is not equal to 1
    function renderPreviousIcon(searchParams, pagination) {
        if (pagination.currentPage === 1) {
            return ""
        } else {
            return `<li class="page-item"><a class="page-link" href="${SITEURL}?${searchParams.toString()}&page=${pagination.previousPage}" aria-label="Previous" id="back-btn">
<span aria-hidden="true">&laquo;</span>
<span class="sr-only">Previous</span></a></li>`
        }
    }

// Function to render >> forward button only if next page is not equal to 0
    function renderForwardIcon(searchParams, pagination) {
        if (pagination.nextPage === 0) {
            return ""
        } else {
            return `<li class="page-item"><a class="page-link" href="${SITEURL}?${searchParams.toString()}&page=${pagination.nextPage}" aria-label="Previous">
<span aria-hidden="true">&raquo;</span>
<span class="sr-only">Next</span></a></li>`
        }
    }

//Function to display price if not undefined, display MSRP price crossed out if exists and is greater than price
    function renderResults(result) {
        let html = ""
        if (result.price === undefined) {
            html += `<div class="product-men">
							<div class="men-pro-item">
							<div class="men-thumb-item">
								<img alt="thumbnail-image" src="${result.thumbnailImageUrl}" onError="this.onerror=null;this.src='images/No-image-found.jpeg';"/>
							</div>
							<div class="item-info-product">
								<h4>${result.name}</h4>
									<div class="info-product-price">
										<h5 class="product_price"> Price:
											<span class="money">Not Listed</span>
										</h5>
									</div>
							</div>
							</div>
						</div>`
        } else if (result.msrp !== null && result.price < result.msrp) {
            html += `<div class="product-men">
							<div class="men-pro-item">
							<div class="men-thumb-item">
								<img alt="thumbnail-image" src="${result.thumbnailImageUrl}" onError="this.onerror=null;this.src='images/No-image-found.jpeg';"/>
							</div>
							<div class="item-info-product">
								<h4>${result.name}</h4>
									<div class="info-product-price">
										<h5 class="product_price"> Price:
											<span class="money">$${result.price}</span>
											<span class="money" id="msrp-price">$${result.msrp}</span>
										</h5>
									</div>
							</div>
							</div>
						</div>`
        } else {
            html += `<div class="product-men">
							<div class="men-pro-item">
								<div class="men-thumb-item">
									<img alt="thumbnail-image" src="${result.thumbnailImageUrl}" onError="this.onerror=null;this.src='images/No-image-found.jpeg';"/>
								</div>
							<div class="item-info-product">
								<h4>${result.name}</h4>
									<div class="info-product-price">
										<h5 class="product_price"> Price:
											<span class="money">$${result.price}</span>
										</h5>
									</div>
							</div>
							</div>
						</div>`
        }
        $('.product-sec1').append(html);
    }

//function to delete page parameter when refreshing page to avoid duplicate page parameters
    function deletePageParam(searchParams) {
        if (searchParams.has('page')) searchParams.delete("page");
    }

//Search User Input
    $('#submit').click(function (e) {
        e.preventDefault();
        let searchInput = $('#search').val();

        //Check URL Search Params in window location to set query string as searchInput and request new results
        if ('URLSearchParams' in window) {
            deletePageParam(searchParams)

            searchParams.set("q", searchInput);
            window.location.search = searchParams.toString();
        }
    });
})();