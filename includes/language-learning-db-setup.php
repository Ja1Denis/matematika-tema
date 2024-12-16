<?php
/**
 * Database setup for Language Learning Application
 */

function create_language_learning_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    // Table for words
    $table_words = $wpdb->prefix . 'language_words';
    
    $sql_words = "CREATE TABLE IF NOT EXISTS $table_words (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        croatian_word varchar(255) NOT NULL,
        english_word varchar(255) NOT NULL,
        category varchar(50) NOT NULL,
        difficulty varchar(20) NOT NULL,
        example_sentence text,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_words);

    // Insert sample data only if the table is empty
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_words");
    
    if ($count == 0) {
        $sample_words = array(
            // Basic Words - Family
            array('mama', 'mother', 'family', 'beginner', 'Moja mama kuha ručak. / My mother is cooking lunch.'),
            array('tata', 'father', 'family', 'beginner', 'Moj tata vozi auto. / My father drives a car.'),
            array('brat', 'brother', 'family', 'beginner', 'Imam starijeg brata. / I have an older brother.'),
            array('sestra', 'sister', 'family', 'beginner', 'Moja sestra ide u školu. / My sister goes to school.'),
            
            // Basic Words - Animals
            array('pas', 'dog', 'animals', 'beginner', 'Pas laje u dvorištu. / The dog barks in the yard.'),
            array('mačka', 'cat', 'animals', 'beginner', 'Mačka spava na kauču. / The cat sleeps on the couch.'),
            array('ptica', 'bird', 'animals', 'beginner', 'Ptica leti na nebu. / The bird flies in the sky.'),
            array('riba', 'fish', 'animals', 'beginner', 'Riba pliva u moru. / The fish swims in the sea.'),
            
            // Basic Words - Food
            array('kruh', 'bread', 'food', 'beginner', 'Volim svježi kruh. / I love fresh bread.'),
            array('mlijeko', 'milk', 'food', 'beginner', 'Pijem mlijeko za doručak. / I drink milk for breakfast.'),
            array('jabuka', 'apple', 'food', 'beginner', 'Jabuka je crvena. / The apple is red.'),
            array('voda', 'water', 'food', 'beginner', 'Čaša vode, molim. / A glass of water, please.'),
            
            // Intermediate Words - Emotions
            array('sreća', 'happiness', 'emotions', 'intermediate', 'Sreća je važna u životu. / Happiness is important in life.'),
            array('ljubav', 'love', 'emotions', 'intermediate', 'Ljubav prema obitelji je važna. / Love for family is important.'),
            array('strah', 'fear', 'emotions', 'intermediate', 'Nemoj se bojati mraka. / Don\'t be afraid of the dark.'),
            array('ljutnja', 'anger', 'emotions', 'intermediate', 'Kontroliraj svoju ljutnju. / Control your anger.'),
            
            // Intermediate Words - Nature
            array('šuma', 'forest', 'nature', 'intermediate', 'Šuma je puna drveća. / The forest is full of trees.'),
            array('more', 'sea', 'nature', 'intermediate', 'More je plavo i mirno. / The sea is blue and calm.'),
            array('planina', 'mountain', 'nature', 'intermediate', 'Planina je prekrivena snijegom. / The mountain is covered with snow.'),
            array('rijeka', 'river', 'nature', 'intermediate', 'Rijeka teče kroz grad. / The river flows through the city.'),
            
            // Advanced Words - Abstract Concepts
            array('sloboda', 'freedom', 'abstract', 'advanced', 'Sloboda je osnovno ljudsko pravo. / Freedom is a basic human right.'),
            array('vrijeme', 'time', 'abstract', 'advanced', 'Vrijeme brzo prolazi. / Time passes quickly.'),
            array('znanje', 'knowledge', 'abstract', 'advanced', 'Znanje je moć. / Knowledge is power.'),
            array('istina', 'truth', 'abstract', 'advanced', 'Istina uvijek izađe na vidjelo. / The truth always comes to light.'),
            
            // Advanced Words - Professional
            array('sastanak', 'meeting', 'professional', 'advanced', 'Imam važan sastanak sutra. / I have an important meeting tomorrow.'),
            array('posao', 'job', 'professional', 'advanced', 'Tražim novi posao. / I\'m looking for a new job.'),
            array('projekt', 'project', 'professional', 'advanced', 'Radim na velikom projektu. / I\'m working on a big project.'),
            array('izvještaj', 'report', 'professional', 'advanced', 'Moram napisati izvještaj. / I need to write a report.')
        );

        foreach ($sample_words as $word) {
            $wpdb->insert(
                $table_words,
                array(
                    'croatian_word' => $word[0],
                    'english_word' => $word[1],
                    'category' => $word[2],
                    'difficulty' => $word[3],
                    'example_sentence' => $word[4]
                ),
                array('%s', '%s', '%s', '%s', '%s')
            );
        }
    }
}

// Hook for activating the plugin
add_action('init', 'create_language_learning_tables');

// Function to get words from database
function get_language_words($category = null, $difficulty = null) {
    global $wpdb;
    $table_words = $wpdb->prefix . 'language_words';
    
    $query = "SELECT * FROM $table_words";
    $where_clauses = array();
    
    if ($category) {
        $where_clauses[] = $wpdb->prepare("category = %s", $category);
    }
    
    if ($difficulty) {
        $where_clauses[] = $wpdb->prepare("difficulty = %s", $difficulty);
    }
    
    if (!empty($where_clauses)) {
        $query .= " WHERE " . implode(" AND ", $where_clauses);
    }
    
    return $wpdb->get_results($query);
}

// Function to get random words for a game session
function get_random_words($count = 10, $category = null, $difficulty = null) {
    global $wpdb;
    $table_words = $wpdb->prefix . 'language_words';
    
    $query = "SELECT * FROM $table_words";
    $where_clauses = array();
    
    if ($category) {
        $where_clauses[] = $wpdb->prepare("category = %s", $category);
    }
    
    if ($difficulty) {
        $where_clauses[] = $wpdb->prepare("difficulty = %s", $difficulty);
    }
    
    if (!empty($where_clauses)) {
        $query .= " WHERE " . implode(" AND ", $where_clauses);
    }
    
    $query .= " ORDER BY RAND() LIMIT %d";
    
    return $wpdb->get_results($wpdb->prepare($query, $count));
}
?>
