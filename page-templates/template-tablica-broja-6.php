<?php
/**
 * Template Name: Tablica broja 6
 */

get_header();
?>

<div class="container tablica-broja-6">
    <header>
        <h1>Tablica množenja broja 6</h1>
        <div class="controls">
            <button id="generirajZadatke">Generiraj nove zadatke</button>
            <button id="provjeriOdgovore">Provjeri sve odgovore</button>
            <button onclick="window.print()">Ispiši</button>
        </div>
        <div class="test-info">
            <div id="brojTocnih">Točnih odgovora: 0</div>
            <div id="brojNetocnih">Netočnih odgovora: 0</div>
        </div>
    </header>

    <div class="tablica-container">
        <table>
            <tr>
                <th>×</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
                <th>10</th>
            </tr>
            <tr>
                <th>1</th>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
                <td>9</td>
                <td>10</td>
            </tr>
            <tr>
                <th>2</th>
                <td>2</td>
                <td>4</td>
                <td>6</td>
                <td>8</td>
                <td>10</td>
                <td>12</td>
                <td>14</td>
                <td>16</td>
                <td>18</td>
                <td>20</td>
            </tr>
            <tr>
                <th>3</th>
                <td>3</td>
                <td>6</td>
                <td>9</td>
                <td>12</td>
                <td>15</td>
                <td>18</td>
                <td>21</td>
                <td>24</td>
                <td>27</td>
                <td>30</td>
            </tr>
            <tr>
                <th>4</th>
                <td>4</td>
                <td>8</td>
                <td>12</td>
                <td>16</td>
                <td>20</td>
                <td>24</td>
                <td>28</td>
                <td>32</td>
                <td>36</td>
                <td>40</td>
            </tr>
            <tr>
                <th>6</th>
                <td>6</td>
                <td>12</td>
                <td>18</td>
                <td>24</td>
                <td>30</td>
                <td>36</td>
                <td>42</td>
                <td>48</td>
                <td>54</td>
                <td>60</td>
            </tr>
        </table>
    </div>

    <div id="zadaciContainer" class="zadaci-container">
        <!-- Zadaci će biti dinamički generirani kroz JavaScript -->
    </div>
</div>

<?php
// Registracija stilova i skripti
wp_enqueue_style('tablica-broja-6-style', get_template_directory_uri() . '/assets/css/tablica-broja-6.css', array(), '1.0.0');
wp_enqueue_script('tablica-broja-6-script', get_template_directory_uri() . '/assets/js/tablica-broja-6.js', array('jquery'), '1.0.0', true);
wp_enqueue_script('jquery');
wp_dequeue_script('matematicka-igra');
?>

<?php get_footer(); ?>