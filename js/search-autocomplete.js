jQuery(document).ready(function($) {
    // Inicijalizacija autocomplete-a
    $('.search-field').autocomplete({
        source: function(request, response) {
            $.ajax({
                url: searchAutocomplete.ajaxurl,
                dataType: 'json',
                data: {
                    action: 'search_autocomplete',
                    term: request.term
                },
                success: function(data) {
                    if (data.success && data.data) {
                        response($.map(data.data, function(item) {
                            return {
                                label: item.title,
                                value: item.title,
                                url: item.url,
                                type: item.type
                            };
                        }));
                    }
                }
            });
        },
        minLength: 2,
        select: function(event, ui) {
            if (ui.item) {
                window.location.href = ui.item.url;
                return false;
            }
        }
    }).data('ui-autocomplete')._renderItem = function(ul, item) {
        // Prilagođeni prikaz rezultata
        return $('<li>')
            .append('<div class="autocomplete-item">' +
                     '<span class="autocomplete-title">' + item.label + '</span>' +
                     '<span class="autocomplete-type">' + item.type + '</span>' +
                   '</div>')
            .appendTo(ul);
    };
});
