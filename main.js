/* ============================================================
   main.js — dizzled.dev
   ============================================================

   TABLE OF CONTENTS
     1. Matrix rain background
     2. Clock & uptime
     3. Visitor counter
     4. Current status
     5. Now Playing — VU meter
     6. Terminal
     7. Cursor spark effect
   ============================================================ */


/* ============================================================
   1. MATRIX RAIN BACKGROUND
   Draws faint falling characters on the <canvas id="rain">
   element that sits behind all page content.

   TO TWEAK: Change the `opacity` on the canvas element in
   index.html to make it more or less visible (currently 0.06).
   ============================================================ */
(function () {
  var canvas = document.getElementById('rain');
  var ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var chars = '01アイウエカキクサシスタチナニネノ#$%<>/\\|{}[]'.split('');
  var drops = [];

  function initDrops() {
    drops = [];
    var cols = Math.floor(canvas.width / 16);
    for (var i = 0; i < cols; i++) drops.push(1);
  }
  initDrops();
  window.addEventListener('resize', initDrops);

  setInterval(function () {
    ctx.fillStyle = 'rgba(2,10,2,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px Share Tech Mono';

    for (var i = 0; i < drops.length; i++) {
      var char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.97 ? '#ffffff' : '#00ff41';
      ctx.fillText(char, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 55);
})();


/* ============================================================
   2. CLOCK & UPTIME
   Updates every second. Shows your local time (not UTC).
   Also calculates site uptime from a launch date.

   TO EDIT:
   - Change SITE_LAUNCH to the date your site went live.
     Format: new Date('YYYY-MM-DD')
   ============================================================ */
(function () {
  var DAYS   = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // ── EDIT THIS ── set to your actual site launch date
  var SITE_LAUNCH = new Date('2024-01-01');

  function tick() {
    var now = new Date();
    var h   = String(now.getHours()).padStart(2, '0');
    var m   = String(now.getMinutes()).padStart(2, '0');
    var s   = String(now.getSeconds()).padStart(2, '0');
    var timeStr = h + ':' + m + ':' + s;

    // Hero clock
    document.getElementById('hero-clock').textContent = timeStr;

    // Topbar clock — labelled as local, not UTC
    document.getElementById('topbar-clock').textContent = timeStr + ' local';

    // Date line under clock
    document.getElementById('hero-date').textContent =
      DAYS[now.getDay()] + ' ' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      MONTHS[now.getMonth()] + ' ' +
      now.getFullYear();

    // Unix timestamp
    document.getElementById('unix-ts').textContent = Math.floor(now.getTime() / 1000);

    // Site uptime
    var diff      = now - SITE_LAUNCH;
    var days      = Math.floor(diff / 86400000);
    var hours     = Math.floor((diff % 86400000) / 3600000);
    var mins      = Math.floor((diff % 3600000)  / 60000);
    var uptimeStr = days + 'd ' + hours + 'h ' + mins + 'm';

    document.getElementById('uptime-display').textContent = uptimeStr;
    document.getElementById('ticker-uptime').textContent  = uptimeStr;
  }

  setInterval(tick, 1000);
  tick(); // run immediately so there's no blank flash on load
})();


/* ============================================================
   3. VISITOR COUNTER
   Uses localStorage to persist and increment a visit count.
   Real — it actually increments on every page load in that browser.

   NOTE: This is per-browser, not a global server-side counter.
   Two different people will each have their own independent count.
   For a real global counter, replace this block with an API call
   to something like hits.seeyoufarm.com.

   TO EDIT:
   - Change STARTING_COUNT to set the number new visitors start from.
   - Change STORAGE_KEY if you want a fresh count (old key is forgotten).
   ============================================================ */
(function () {
  var STARTING_COUNT = 1337; // visitors start from this number
  var STORAGE_KEY    = 'dizzle_visit_count';

  var stored = localStorage.getItem(STORAGE_KEY);
  var count  = stored ? parseInt(stored, 10) : STARTING_COUNT;
  count++;
  localStorage.setItem(STORAGE_KEY, count);

  document.getElementById('vcounter').textContent = count.toLocaleString();
  document.getElementById('you-are').textContent  = '#' + count.toLocaleString();
})();


/* ============================================================
   4. CURRENT STATUS
   Picks a random status string on every page load and
   displays it in the hero bio and the bio panel.

   TO EDIT: Change the strings in the statuses array to
   whatever you're actually up to right now.
   ============================================================ */
(function () {
  // ── EDIT THESE ── what are you actually doing?
  var statuses = [
    'adding more drives to the nas',
    'writing another ansible playbook',
    'reading manpages again',
    'chasing a rabbit hole',
    'staring at grafana dashboards',
    'somewhere on the internet',
    'probably configuring something',
  ];

  var pick = statuses[Math.floor(Math.random() * statuses.length)];

  document.getElementById('current-status').textContent = pick;
  document.getElementById('bio-current').textContent    = pick;
})();


/* ============================================================
   5. NOW PLAYING — VU METER
   Creates and animates the fake spectrum analyser bars above
   the track info in the Now Playing panel.
   Purely decorative — no editing needed here.
   ============================================================ */
(function () {
  var meter    = document.getElementById('vu-meter');
  var bars     = [];
  var BAR_COUNT = 18;

  // Create the bars
  for (var i = 0; i < BAR_COUNT; i++) {
    var bar = document.createElement('div');
    bar.style.cssText = [
      'width: 6px',
      'background: var(--magenta)',
      'border-radius: 1px',
      'height: 4px',
      'transition: height 0.15s',
      'box-shadow: 0 0 3px var(--magenta)',
    ].join(';');
    meter.appendChild(bar);
    bars.push(bar);
  }

  // Animate the bars
  setInterval(function () {
    for (var i = 0; i < bars.length; i++) {
      // Taller in the middle, shorter at the edges (spectrum shape)
      var center = Math.sin((i / bars.length) * Math.PI);
      var h = Math.max(3, Math.floor((Math.random() * 20 + 4) * (0.5 + center * 0.6)));
      bars[i].style.height = h + 'px';
    }
  }, 150);
})();


/* ============================================================
   6. TERMINAL
   Handles the interactive terminal widget.
   Listens for Enter key on the input, looks up the command,
   and prints the output above the blinking cursor line.

   TO ADD A COMMAND:
     Add a new key/function pair to the `commands` object below.
     The key = what the user types.
     The function must return an array of strings (each = one line).

   SPECIAL: returning ['__CLEAR__'] clears all terminal output.

   TO EDIT existing commands:
   - `lab`     → list your actual homelab nodes
   - `stack`   → your actual OS / editor / shell
   - `contact` → your actual handles
   ============================================================ */
(function () {

  // ── EDIT THESE ── terminal command responses
  var commands = {

    help: function () {
      return ['commands: whoami, ls, lab, stack, contact, date, uname, ping, ssh, sudo, reboot, clear'];
    },

    whoami: function () {
      return ['dizzle — it enthusiast, homelab hoarder, security tinkerer'];
    },

    ls: function () {
      return ['about.txt  projects/  notes/  homelab/  .ssh/'];
    },

    // ── EDIT THIS ── replace with your actual nodes
    lab: function () {
      return ['nodes: [YOUR_NODES_HERE]  — edit the lab command in main.js'];
    },

    // ── EDIT THIS ── replace with your actual tools
    stack: function () {
      return ['os: [YOUR_OS]  |  editor: [YOUR_EDITOR]  |  shell: [YOUR_SHELL]'];
    },

    // ── EDIT THIS ── replace with your actual handles
    contact: function () {
      return ['discord: dizzle  |  github: github.com/[YOUR_GITHUB]  |  see links panel'];
    },

    date: function () {
      return [new Date().toString()];
    },

    uname: function () {
      return ['Linux void 6.1.0-dizzle #1 SMP x86_64 GNU/Linux'];
    },

    pwd: function () {
      return ['/home/dizzle'];
    },

    ping: function () {
      return ['PING self: alive. packet loss: 0%. status: caffeinated.'];
    },

    ssh: function () {
      return ['Permission denied (publickey). nice try though.'];
    },

    sudo: function () {
      return ['you are not in the sudoers file. this incident will be reported.'];
    },

    cat: function () {
      return ['try: cat about.txt — but i already ran it for you above.'];
    },

    reboot: function () {
      return ['rebooting... just kidding. uptime is a point of pride.'];
    },

    hello: function () {
      return ['hey. welcome.'];
    },

    exit: function () {
      return ["nice try. you're already in."];
    },

    clear: function () {
      return ['__CLEAR__'];
    },

  };

  // ── DOM references ──
  var termEl    = document.getElementById('term');
  var termInput = document.getElementById('term-input');

  // ── Listen for Enter key in the input ──
  termInput.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;

    var raw = this.value.trim();
    var cmd = raw.toLowerCase().split(' ')[0];
    this.value = '';

    // All new lines go before the cursor line
    var cursorLine = document.getElementById('term-cursor').parentElement;

    function addLine(cssClass, text) {
      var div = document.createElement('div');
      div.className   = cssClass;
      div.textContent = text;
      termEl.insertBefore(div, cursorLine);
    }

    // Echo back what the user typed
    addLine('', 'dizzle@void:~$ ' + raw);
    if (!cmd) return;

    var handler = commands[cmd];

    // Unknown command
    if (!handler) {
      addLine('e', "command not found: " + cmd + ". type 'help' for options.");
      return;
    }

    var output = handler();

    // Special case: clear the terminal
    if (output[0] === '__CLEAR__') {
      termEl.innerHTML = [
        '<div>',
        '  <span class="p">dizzle@void:~$</span>',
        '  <span class="cmd" id="term-cursor" style="animation:blink 1s step-end infinite;">█</span>',
        '</div>',
      ].join('');
      return;
    }

    // Print each line of output
    output.forEach(function (line) { addLine('out', line); });

    // Trim terminal if it gets too long
    while (termEl.children.length > 24) {
      termEl.removeChild(termEl.firstChild);
    }
  });

})();


/* ============================================================
   7. CURSOR SPARK EFFECT
   Spawns small binary/symbol characters that float upward
   from the mouse cursor as you move it around the page.

   TO REMOVE: delete this entire block.
   TO REDUCE: increase the threshold in the Math.random() check
              (e.g. > 0.96 fires less often than > 0.92).
   ============================================================ */
(function () {
  var sparkChars = '01#$<>/|█▓░'.split('');
  var colors     = ['#00ff41', '#00ffff', '#ff00ff'];

  document.addEventListener('mousemove', function (e) {
    if (Math.random() > 0.92) return; // fires on ~8% of mouse moves

    var spark         = document.createElement('div');
    spark.className   = 'spark';
    spark.textContent = sparkChars[Math.floor(Math.random() * sparkChars.length)];
    spark.style.color = colors[Math.floor(Math.random() * colors.length)];
    spark.style.left  = (e.clientX + Math.random() * 14 - 7) + 'px';
    spark.style.top   = (e.clientY + Math.random() * 14 - 7) + 'px';

    document.body.appendChild(spark);
    setTimeout(function () { spark.remove(); }, 700);
  });
})();
