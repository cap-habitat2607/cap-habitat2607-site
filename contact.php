<?php
// Formulaire de contact Cap Habitat 26-07 — hébergement OVH (fonction mail() de PHP)
// Adresse qui reçoit les messages :
$destinataire = 'contact@cap-habitat2607.fr';
// Adresse d'envoi : doit être une adresse de VOTRE domaine (exigence OVH)
$expediteur   = 'contact@cap-habitat2607.fr';

header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Méthode non autorisée'); }

// Piège à robots : ce champ invisible doit rester vide
if (!empty($_POST['site_web'])) { exit('OK'); }

function propre($v) { return trim(str_replace(["\r", "\n"], ' ', strip_tags($v ?? ''))); }

$nom       = propre($_POST['nom'] ?? '');
$telephone = propre($_POST['telephone'] ?? '');
$email     = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$projet    = propre($_POST['projet'] ?? '');
$message   = trim(strip_tags($_POST['message'] ?? ''));

if ($nom === '' || !$email || $telephone === '' || mb_strlen($message) < 100) { http_response_code(400); exit('Champs manquants'); }

$sujet = '=?UTF-8?B?' . base64_encode('Site web — ' . $projet . ' — ' . $nom) . '?=';
$corps = "Nouveau message depuis cap-habitat2607.fr\n\n"
       . "Nom : $nom\nTéléphone : $telephone\nE-mail : $email\nProjet : $projet\n\n"
       . "Message :\n$message\n";

$entetes = "From: Cap Habitat 26-07 <$expediteur>\r\n"
         . "Reply-To: $email\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($destinataire, $sujet, $corps, $entetes)) { echo 'OK'; }
else { http_response_code(500); echo 'Erreur'; }
