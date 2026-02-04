/* ARG — Protocole Effort : 3 étapes puis validation des fragments */

var ARG_FRAGMENTS = { 1: 'ESSAYER', 2: 'COMPRENDRE', 3: 'VÉRIFIER' };

var WHATSAPP_MESSAGE =
  'La meilleure façon d\'utiliser l\'IA est d\'ESSAYER une ou plusieurs questions, de COMPRENDRE et de VÉRIFIER la réponse qu\'il te donne.\n' +
  'IA = outil de vérification et d\'amélioration. Pas un remplacement du cerveau.\n\n' +
  'Cette règle dépasse l\'école :\n' +
  '· Sport : essayer avant de demander au coach\n' +
  '· Business : tester avant de copier un modèle\n' +
  '· Relations : réfléchir avant de réagir\n' +
  '· Vie : construire avant de comparer\n\n' +
  'La facilité immédiate coûte cher à long terme. L\'effort mental est un muscle.\n\n' +
  '📷 Pense à partager l\'image « La boucle étrange de l\'IA » (téléchargeable sur la page du Protocole Effort).';

function step1() {
  var ok1 = document.querySelector('input[name="q1"][value="ok"]:checked');
  var ok2 = document.querySelector('input[name="q2"][value="ok"]:checked');
  var res = document.getElementById('res1');
  var next = document.getElementById('next1');
  var btn = document.getElementById('btn-step');

  if (!ok1 || !ok2) {
    alert('Réponses incorrectes. Réfléchis avant de valider.');
    return;
  }

  sessionStorage.setItem('arg_frag1', ARG_FRAGMENTS[1]);
  res.innerHTML = 'Effort détecté.<br><span class="fragment-badge">🎁 Fragment 1 obtenu : FRAG-1 = ESSAYER</span>';
  res.className = 'result result-fragment show';
  btn.className = 'mask-btn';
  if (next) {
    next.innerHTML = '<a href="step-2.html" class="btn-primary btn-next">Passer à l\'étape 2</a>';
  } else {
    setTimeout(function () { window.location.href = 'step-2.html'; }, 2000);
  }
}

function step2() {
  var count = 0;
  [1, 2, 3, 4, 5].forEach(function (i) {
    if (document.querySelector('input[name="m' + i + '"]:checked')) count++;
  });
  var niveau = count >= 3 ? 'élevé' : 'moyen';
  var res = document.getElementById('res2');
  var next = document.getElementById('next2');
  var btn = document.getElementById('btn-step');
  sessionStorage.setItem('arg_frag2', ARG_FRAGMENTS[2]);
  res.innerHTML =
    'Réflexe IA : <strong>' + niveau + '</strong>.<br>' +
    'Risque : baisse progressive de l\'endurance mentale.<br>' +
    '<span class="fragment-badge">🎁 Fragment 2 obtenu : FRAG-2 = COMPRENDRE</span>';
  res.className = 'result result-fragment show';
  btn.className = 'mask-btn';
  if (next) {
    next.innerHTML = '<a href="step-3.html" class="btn-primary btn-next">Passer à l\'étape 3</a>';
  } else {
    setTimeout(function () { window.location.href = 'step-3.html'; }, 2000);
  }
}

function step3() {
  var ok = document.querySelector('input[name="q3"][value="ok"]:checked');
  var res = document.getElementById('res3');
  var next = document.getElementById('next3');
  var btn = document.getElementById('btn-step');
  if (!ok) {
    alert('Analyse insuffisante. Prouve que tu sais utiliser l\'IA correctement.');
    return;
  }

  sessionStorage.setItem('arg_frag3', ARG_FRAGMENTS[3]);
  res.innerHTML = 'Templates débloqués.<br><span class="fragment-badge">🎁 Fragment 3 obtenu : FRAG-3 = VÉRIFIER</span>';
  res.className = 'result result-fragment show';
  btn.className = 'mask-btn';
  if (next) {
    next.innerHTML = '<a href="acces.html" class="btn-primary btn-next">Valider</a>';
  } else {
    setTimeout(function () { window.location.href = 'acces.html'; }, 2000);
  }
}

function openWhatsApp() {
  var url = 'https://wa.me/?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
  window.open(url, '_blank');
}

/**
 * Partage image + message via l’API Web Share (mobile : WhatsApp reçoit les deux).
 * Sinon retombe sur le partage du message seul (wa.me).
 */
function shareWithImage() {
  var img = document.querySelector('.final-moral-img');
  if (!img || !navigator.share) {
    openWhatsApp();
    return;
  }

  fetch(img.src)
    .then(function (r) { return r.blob(); })
    .then(function (blob) {
      var file = new File([blob], 'moral_ia.png', { type: blob.type || 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({
          text: WHATSAPP_MESSAGE,
          files: [file]
        });
      }
      throw new Error('Partage de fichier non supporté');
    })
    .then(function () {
      /* partage réussi */
    })
    .catch(function () {
      openWhatsApp();
    });
}
