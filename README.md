# Requirements:

# Search API
Build out a very simple search page using the Search API.
https://searchspring.zendesk.com/hc/en-us/sections/115000119223-Search-API

- Ignore the "Request Headers" section of any of the API documentation
- Use "q", "resultsFormat" and "page" query parameters

# Searchbar
- Input box for a Search Bar with a button next to it
- When the search button is CLICKED, or user presses ENTER, the results display below

# Displaying the Results
- Use site ID “scmq7n” for this example
- Use “resultsFormat=native” as part of the API request to get your results back as JSON
pass the search query using the “q” parameter
- Display the product image using the “thumbnailImageUrl”, the product “name” and “price”
- If the product has an “msrp” field and it’s greater than “price” field, display the “msrp” next to the price crossed out.

# Pagination
- Above and below the results show pagination with next and previous buttons
- You could also display some pages before/after the current page as applicable
- If on the first page, you shouldn’t show the previous button or it should be disabled
- If on the last page, you shouldn’t show the next button or it should be disabled
- You’ll be able to change the page by making another request to our Search API with the “page” parameter set to the page you’d like to request
