jQuery(document).ready(function($) {
    // Inicijalizacija pri učitavanju stranice
    generateNewTask();
    
    // Event listener za gumb "Novi zadatak"
    $('#newTask').on('click', function() {
        generateNewTask();
        $('#userAnswer').val('');
        $('#result').html('');
    });
    
    // Event listener za gumb "Provjeri"
    $('#checkAnswer').on('click', checkAnswer);
    
    // Event listener za Enter tipku u input polju
    $('#userAnswer').on('keypress', function(e) {
        if (e.which === 13) {
            checkAnswer();
        }
    });
    
    // Event listener za gumb "Ispiši zadatke"
    $('#printTasks').on('click', function() {
        generatePrintPreview();
        $('#printPreview').show();
    });
    
    // Event listeneri za print preview
    $('#doPrint').on('click', function() {
        window.print();
    });
    
    $('#closePreview').on('click', function() {
        $('#printPreview').hide();
    });
});
