(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var WHATS = "5519992745506";

  document.querySelectorAll("[role=tablist]").forEach(function (lista) {
    var tabs = lista.querySelectorAll("[role=tab]");
    function ativar(tab) {
      tabs.forEach(function (t) {
        var sel = t === tab;
        t.setAttribute("aria-selected", String(sel));
        t.tabIndex = sel ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !sel;
      });
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        ativar(t);
      });
    });
    var hash = location.hash.replace("#", "");
    tabs.forEach(function (t) {
      if (t.dataset.hash === hash) ativar(t);
    });
  });

  document.querySelectorAll("form[data-whats]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var linhas = [form.dataset.whats];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === "submit") return;
        if (el.type === "checkbox") {
          if (el.checked) linhas.push("✔ " + el.dataset.label);
          return;
        }
        if (el.value) linhas.push((el.dataset.label || el.name) + ": " + el.value);
      });
      window.open(
        "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(linhas.join("\n")),
        "_blank",
        "noopener",
      );
    });
  });

  document.querySelectorAll("[data-copiar]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copiar");
      var ok = function () {
        var o = b.textContent;
        b.textContent = "Copiado!";
        setTimeout(function () {
          b.textContent = o;
        }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok);
      else ok();
    });
  });

  var CHAVE = "pc_carrinho";
  function ler() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch (e) {
      return {};
    }
  }
  function salvar(c) {
    localStorage.setItem(CHAVE, JSON.stringify(c));
    render();
  }
  function brl(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function render() {
    var c = ler(),
      total = 0,
      qtd = 0;
    Object.keys(c).forEach(function (k) {
      qtd += c[k].q;
      total += c[k].q * c[k].p;
    });
    document.querySelectorAll(".carrinho-qtd").forEach(function (el) {
      el.textContent = qtd;
    });
    var lista = document.getElementById("carrinho-lista");
    if (!lista) return;
    lista.innerHTML = "";
    if (!qtd) {
      lista.innerHTML = "<li>Seu carrinho está vazio.</li>";
    }
    Object.keys(c).forEach(function (k) {
      var li = document.createElement("li");
      li.innerHTML =
        "<span><strong></strong><br><small></small></span><span class='qtd'><button type='button' aria-label='Diminuir'>−</button><span></span><button type='button' aria-label='Aumentar'>+</button></span>";
      li.querySelector("strong").textContent = k;
      li.querySelector("small").textContent = brl(c[k].p) + " cada";
      li.querySelector(".qtd span").textContent = c[k].q;
      var bs = li.querySelectorAll("button");
      bs[0].addEventListener("click", function () {
        var n = ler();
        n[k].q--;
        if (n[k].q <= 0) delete n[k];
        salvar(n);
      });
      bs[1].addEventListener("click", function () {
        var n = ler();
        n[k].q++;
        salvar(n);
      });
      lista.appendChild(li);
    });
    document.getElementById("carrinho-total").textContent = brl(total);
    document.getElementById("finalizar").disabled = !qtd;
  }
  document.querySelectorAll("[data-produto]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = ler(),
        n = b.dataset.produto;
      c[n] = c[n] || { q: 0, p: parseFloat(b.dataset.preco) };
      c[n].q++;
      salvar(c);
      b.textContent = "Adicionado ✓";
      setTimeout(function () {
        b.textContent = "Adicionar ao carrinho";
      }, 1500);
    });
  });
  var fin = document.getElementById("finalizar");
  if (fin)
    fin.addEventListener("click", function () {
      var c = ler(),
        linhas = ["Olá! Quero colaborar com o Pernas Caipiras:"],
        t = 0;
      Object.keys(c).forEach(function (k) {
        linhas.push(c[k].q + "x " + k + " (" + brl(c[k].p) + ")");
        t += c[k].q * c[k].p;
      });
      linhas.push("Total: " + brl(t));
      window.open(
        "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(linhas.join("\n")),
        "_blank",
        "noopener",
      );
    });
  render();

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
