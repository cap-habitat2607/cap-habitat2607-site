<?php
// Avis Google — Cap Habitat 26-07
// Récupère la note et les avis de la fiche Google, avec mise à jour automatique
// toutes les 12 h (cache), via l'API Google Places (New).
//
// RÉGLAGE : la clé API Google n'est PAS stockée ici (le dépôt GitHub est public).
// Elle se trouve dans un petit fichier "cle-google.php" placé À CÔTÉ du dossier www
// (un niveau au-dessus), envoyé une seule fois avec FileZilla. Contenu de ce fichier :
//   <?php $CLE_API = 'votre-cle';
$CLE_API = '';
if (is_file(__DIR__ . '/../cle-google.php')) { include __DIR__ . '/../cle-google.php'; }
$PLACE_ID = 'ChIJD9xCv0tJ9UcR53-o34F-Tz4'; // fiche Google "CAP HABITAT 26-07"
$DUREE_CACHE = 12 * 3600;                   // 12 heures

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$cache = __DIR__ . '/avis-cache.json';

// Cache encore valable : on le renvoie directement
if (is_file($cache) && (time() - filemtime($cache)) < $DUREE_CACHE) { readfile($cache); exit; }

if ($CLE_API === '') {
  if (is_file($cache)) { readfile($cache); exit; }
  echo json_encode(['erreur' => 'cle_api_manquante']); exit;
}

$url = 'https://places.googleapis.com/v1/places/' . rawurlencode($PLACE_ID) . '?languageCode=fr';
$ctx = stream_context_create(['http' => [
  'method'  => 'GET',
  'timeout' => 8,
  'header'  => "X-Goog-Api-Key: $CLE_API\r\n"
             . "X-Goog-FieldMask: displayName,rating,userRatingCount,googleMapsUri,reviews\r\n"
             . "Referer: https://cap-habitat2607.fr/\r\n",
]]);
$brut = @file_get_contents($url, false, $ctx);
$data = $brut ? json_decode($brut, true) : null;

if (!$data || isset($data['error'])) {
  // En cas d'erreur, on garde les derniers avis connus
  if (is_file($cache)) { readfile($cache); exit; }
  echo json_encode(['erreur' => 'api']); exit;
}

$avis = [];
foreach (($data['reviews'] ?? []) as $r) {
  $texte = $r['originalText']['text'] ?? ($r['text']['text'] ?? '');
  if ($texte === '') continue;
  $avis[] = [
    'auteur' => $r['authorAttribution']['displayName'] ?? 'Client Google',
    'photo'  => $r['authorAttribution']['photoUri'] ?? '',
    'lien'   => $r['authorAttribution']['uri'] ?? '',
    'note'   => (int)($r['rating'] ?? 5),
    'texte'  => $texte,
    'date'   => $r['relativePublishTimeDescription'] ?? '',
  ];
}

$sortie = json_encode([
  'note'     => $data['rating'] ?? null,
  'nombre'   => $data['userRatingCount'] ?? 0,
  'lienFiche'=> $data['googleMapsUri'] ?? '',
  'avis'     => $avis,
  'maj'      => date('c'),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

@file_put_contents($cache, $sortie);
echo $sortie;
