const gData = {
  nodes: [],
  links: []
};
var gun;
const main = function () {
  //////////////////////////////////////////////////////////
  /// APP
  var url = new URL(location.href);
  var mysoul = url.searchParams.get("soul");
  var peers = url.searchParams.get("peer");

  if (peers) {
    peers = peers.split(',');
  }

  gun = Gun(peers || null);
  var app = gun.get(mysoul);

  var ref = app;

  const Graph = ForceGraph3D()
    (document.getElementById('3d-graph'));

  const render = function() {

    console.log('RENDER !!!!');

    Graph
      .graphData(gData)
      .nodeLabel(node => `${node.at.label || node.at.name || node.at.desc || node.client || node.id}`)
      .linkLabel(link => `${link.label || link.name || link.desc || link.id}`)
      .linkDirectionalArrowLength(3.5)
      .linkDirectionalArrowRelPos(1)
      //.linkCurvature(0.25) /// bad performance
      .nodeAutoColorBy('group')
      .linkDirectionalParticles("value")
      .linkDirectionalParticleSpeed(d => (d.value || 1) * 0.001)
      .nodeRelSize(2)
      .nodeVal((node) => {
        if (node.at && typeof node.at.put !== 'object') {
          return 1;
        }
      })
      .onNodeClick(onNodeClick)
    //.d3Force('charge', ()=>10)
    //.d3Force('charge', (a,b) =>{
    //console.log('CHARGE FORCE: ', a,b);
    //})
    ;
  };

  /// UI
  /////////////////////////////////////////
  const onNodeClick = function (node) {
    window.CLIQUED_NODE = node;
    console.log('NODE: ', node);
    $('#view-item').removeClass('hidden');
    let soul = node.id;
    $('#view-item .soul').html(soul);
    gun.get(soul).once((v, k) => {
      //$('#view-item pre').html(JSON.stringify(v, null, '  '));
      $('#view-item .source')
        .removeClass('hidden')
        .html(nodeToHtml(v));
    });
  };

  const nodeToHtml = function (at) {
    let keys = Object.keys(at).filter((e) => e !== '_').sort();
    let attrs = [];
    let links = [];
    let soul = Gun.node.soul(at); //at._['#'];
    keys.map((k) => {
      if (typeof at[k] === 'object') {
        links.push(k);
        return;
      }
      if (null === at[k] || at[k] === '') {
        return;
      }
      attrs.push(k);
    });

    return `
<h3>Soul: <span class="monospace">${soul}</span></h3>
<ul>${attrs.map((k)=>{
  let title = `${typeof at[k]} - ${new Date(at._['>'][k])}`;
  return `<li title="${title}">${k}: ${at[k]}</li>`
}).join(`\n`)}</ul>
<h4>${links && links.length ? 'Links: ' : '<i>no links</i>'}</h4>
<ol class="inline node-links">${links.map((k)=>{
  let link = at[k] ? at[k]['#'] : '';
    var p = (document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    p['soul'] = k;
    var search =  '?' + $.param(p);
  let href = `window.location.origin + window.location.pathname + search;
  return `<li class="truncate node-link inline" title="${soul} -> ${link} (${new Date(at._['>'][k])})"><a target="_${soul}" href="${href}">${k}</a></li>`
}).join(`\n`)}</ol>
  `;
  };

  $('#view-item .control a').on('click', function (event) {
    $('#view-item >').not('.soul:first,.control').toggleClass('hidden');
    $('#view-item').toggleClass('collapsed');
  });

  $('#view-item').on('click', '.btn-unset', function (event) {
    event.preventDefault();
    let soul = $(this).attr('data-soul');
    if (confirm(`Unlink?
    ${soul}`)) {
      console.log('TODO!!! unlink.');
    }
  });

  gun2d3force(ref, gData, render);

};

/// START!!!!
$(document).ready(function () {
  main();
});
