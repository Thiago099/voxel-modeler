(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function ie(i){const e=new Set;function t(o){e.add(o)}function n(o){e.delete(o)}const r={get(o,a){return a==="__subscribe"?t:a==="__unsubscribe"?n:typeof o[a]=="object"&&o[a]!==null&&!(o[a]instanceof HTMLElement)?new Proxy(o[a],r):o[a]},set(o,a,u){o[a]=u;for(const l of e)l.__update();return!0}};return new Proxy(i,r)}function se(i){return oe(new le(i))}function oe(i){function e(n,r){return typeof n[r]!="object"||n[r]!==null?n[r]:new Proxy(n[r],{set:(o,a,u)=>(t.__handleEffect(t.__isReactive(u),()=>{o[a]=t.__handleFunction(u)}),!0),get:(o,a)=>e(o,a)})}const t=new Proxy(i,{get:(n,r)=>{if(r in n)return n[r];if(r in n.__element)return e(n.__element,r)},set:(n,r,s)=>(r in n?n[r]=s:r=="style"?n.$set_style(s):r in n.__element&&n.$property(r,s),!0)});return t}class le{constructor(e){if(typeof e=="string")this.__element=document.createElement(e);else if(e instanceof HTMLElement)this.__element=e;else throw new Error("Invalid element name");this.__events=[],this.__children=[],this.__states=new Set,this.__unmounted_events=[],this.__mounted_events=[],this.__parent=null}__update(){for(const e of this.__events)e()}$click(){return this.__element.click(),this}$find(e){var t=[];this.__element.matches(e)&&t.push(oe(this));for(const n of this.__children)t=t.concat(n.$find(e));return t}$update(){for(const e of this.__events)e();for(const e of this.__children)e.$update()}__parseInput(e){if(e&&e.key=="e0b8fc2b-fc7e-4786-bc05-b85187a8d065"){for(const t of e.elements)t&&t.__subscribe&&(this.__states.add(t),t.__subscribe(this));return e.expression}return e}__observeParent(){setTimeout(()=>{for(const t of this.__mounted_events)t()},0),new MutationObserver(t=>{for(const n of t){if(n.type==="childList"&&n.removedNodes.length){for(const r of n.removedNodes)if(r===this.__element){this.__unsubscribe();for(const s of this.__unmounted_events)s()}}if(n.type==="childList"&&n.addedNodes.length){for(const r of n.addedNodes)if(r===this.__element){this.__subscribe();for(const s of this.__mounted_events)s()}}}}).observe(this.__element.parentElement,{childList:!0})}__subscribe(){if(this.__states)for(const e of this.__states)e.__subscribe(this)}__unsubscribe(){for(const e of this.__children)e.__unsubscribe();if(this.__states)for(const e of this.__states)e.__unsubscribe(this)}__handleFunction(e){return typeof e=="function"?e():e}__handleEffect(e,t){e?(t(),this.__events.push(t)):t()}__isReactive(...e){for(const t of e)if(typeof t=="function")return!0;return!1}$if(e){return e=this.__parseInput(e),this.__handleEffect(this.__isReactive(e),()=>{const t=this.__handleFunction(e);this.$style("display",t?"":"none")}),this}$class(e,t=!0){e=this.__parseInput(e),t=this.__parseInput(t);var n=null;return this.__handleEffect(this.__isReactive(e,t),()=>{const r=this.__handleFunction(e);if(r)if(typeof r=="object")for(const s in r)r[s]?this.__element.classList.add(s):this.__element.classList.remove(s);else this.__handleFunction(t)?(this.__isReactive(e)&&(n&&this.__element.classList.remove(...n.split(" ").filter(s=>s.length>0)),n=r),this.__element.classList.add(...r.split(" ").filter(s=>s.length>0))):(this.__element.classList.remove(...r.split(" ").filter(s=>s.length>0)),n=null)}),this}get parentElement(){return this.__parent}$parent(e){return this.__parent=e,e.__element!==void 0?(e.__element.appendChild(this.__element),e.__children.push(this)):e.appendChild(this.__element),this.__observeParent(),this}$parentBefore(e){return this.__parent=e,e.__element!==void 0?e.__element.firstChild?e.__element.insertBefore(this.__element,e.__element.firstChild):e.__element.appendChild(this.__element):e.firstChild?e.insertBefore(this.__element,e.firstChild):e.appendChild(this.__element),this.__observeParent(),this}$on(e,t){return this.__element.addEventListener(e,t),this}$mounted(e){this.__mounted_events.push(e)}$unmounted(e){this.__unmounted_events.push(e)}$property(e,t){return e=this.__parseInput(e),t=this.__parseInput(t),this.__handleEffect(this.__isReactive(e,t),()=>{this.__element[this.__handleFunction(e)]=this.__handleFunction(t)}),this}$style(e,t=null){return t?(this.__style(e,t),this):(e=this.__parseInput(e),this.__handleEffect(this.__isReactive(e),()=>{var n=this.__handleFunction(e);if(typeof n=="object")for(const r in n)this.__element.style[r]=n[r];else{const r=n.split(";").filter(s=>s.length>0);this.__element.style={};for(const s of r){const[o,a]=s.split(":");this.__element.style[o]=this.__handleFunction(a)}}}),this)}__style(e,t){return e=this.__parseInput(e),t=this.__parseInput(t),this.__handleEffect(this.__isReactive(e,t),()=>{this.__element.style[this.__handleFunction(e)]=this.__handleFunction(t)}),this}$get_computed_style(e){return window.getComputedStyle(this.__element).getPropertyValue(e)}$html(e){return e=this.__parseInput(e),this.__handleEffect(this.__isReactive(e),()=>{this.__element.innerHTML=this.__handleFunction(e)}),this}$child(e){e=this.__parseInput(e);var t;this.__isReactive(e)?t=se("span").$parent(this):t=this;var n=null;return this.__handleEffect(this.__isReactive(e),()=>{var r=this.__handleFunction(e);n&&n();const s=a=>a==null?()=>{}:a.__element!==void 0?(a.$parent(t),()=>a.$remove()):(a instanceof HTMLElement||(a=document.createTextNode(a)),t.__element.appendChild(a),()=>a.remove());if(Array.isArray(r)){var o=[];for(const a of r)o.push(s(a));n=()=>{for(const a of o)a()}}else n=s(r)}),this}$remove(){return this.__parent=null,this.__element.remove(),this}$model([e,t]){return this.$property("value",e),this.$on("input",n=>t(n.target.value)),this}}const R=(i,e,...t)=>{var n,r=!1;if(typeof i=="function"){if(n=i(e,...t),n===void 0)return t;r=!0}else n=se(i);const s={ref:a=>{a.__ref_object=n},style:a=>{n.$style(a)},class:a=>{n.$class(a)},parent:a=>{n.$parent(a)},if:a=>{n.$if(a)},model:([a,u])=>{n.$model([a,u])}},o={on:(a,u)=>{n.$on(a,u)}};if(e)for(const[a,u]of Object.entries(e)){const l=a.split(":");l.length==2?o[l[0]]&&o[l[0]](l[1],u):s[a]?s[a](u):r||n.$property(a,u)}if(t&&!r)for(const a of t)n.$child(a);return n};function ae(i=null){var e=i;return new Proxy({},{get:(n,r)=>{if(e!=null)return e[r]},set:(n,r,s)=>(r==="__ref_object"&&(e=s),s!=null&&(e[r]=s),!0)})}function ue(i){return[(i>>0&255)/255,(i>>8&255)/255,(i>>16&255)/255,1]}function ne(i){return i[0]+(i[1]<<8)+(i[2]<<16)-1}const _e=[[0,0,1,0,0,1,0,0,1,0,0,1],[0,0,-1,0,0,-1,0,0,-1,0,0,-1],[0,1,0,0,1,0,0,1,0,0,1,0],[0,-1,0,0,-1,0,0,-1,0,0,-1,0],[1,0,0,1,0,0,1,0,0,1,0,0],[-1,0,0,-1,0,0,-1,0,0,-1,0,0]],he=[[-1,-1,1,1,-1,1,1,1,1,-1,1,1],[-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1],[-1,1,-1,-1,1,1,1,1,1,1,1,-1],[-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1],[1,-1,-1,1,1,-1,1,1,1,1,-1,1],[-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]],ce=[[0,1,2,0,2,3],[4,5,6,4,6,7],[8,9,10,8,10,11],[12,13,14,12,14,15],[16,17,18,16,18,19],[20,21,22,20,22,23]],de=[[0,1,1,2,2,3,3,0],[4,5,5,6,6,7,7,4],[8,9,9,10,10,11,11,8],[12,13,13,14,14,15,15,12],[16,17,17,18,18,19,19,16],[20,21,21,22,22,23,23,20]],M=[[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]],pe=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];function O(i,e){return i[0]+1==e[0]&&i[1]==e[1]&&i[2]==e[2]}function H(i,e){return i[0]-1==e[0]&&i[1]==e[1]&&i[2]==e[2]}function Y(i,e){return i[1]+1==e[1]&&i[0]==e[0]&&i[2]==e[2]}function X(i,e){return i[1]-1==e[1]&&i[0]==e[0]&&i[2]==e[2]}function G(i,e){return i[2]+1==e[2]&&i[0]==e[0]&&i[1]==e[1]}function W(i,e){return i[2]-1==e[2]&&i[0]==e[0]&&i[1]==e[1]}const j=[[0,1,0,1,0,1],[0,1,0,1,1,0],[0,1,1,0,0,1],[0,1,1,0,1,0],[1,0,0,1,0,1],[1,0,0,1,1,0],[1,0,1,0,0,1],[1,0,1,0,1,0]];class me{constructor(){this.voxels=[[0,0,0]]}build_geometry(){for(var e=[],t=[],n=[],r=[],s=[],o=[],a=[],u=0,l=1,f=0;f<this.voxels.length;f++){for(var c=0,h=0,d=l-1,p=[],g=0;g<6;g++){if(this.faces[f][g]==0){h+=4;continue}n.push(...he[g].map((T,w)=>T+this.voxels[f][w%3]*2-this.center[w%3])),s.push(..._e[g]),a.push(...de[g].map(T=>T+u-h)),r.push(...ce[g].map(T=>T+u-h)),o.push(...pe),c+=4;for(var F=ue(l),A=0;A<4;A++)p.push(...F);l++}u+=c,t.push({start:d,end:l-1}),e.push(...p)}this.id=l,this.distance=u,this.geometry_vertexes=n,this.geometry_indexes=r,this.geometry_normals=s,this.geometry_color=o,this.geometry_edge_index=a,this.pick_map=e,this.pick_meta=t}init(){this.build_boundary(),this.build_center(),this.build_faces(),this.build_geometry()}add(...e){this.voxels.push(...e),this.build_boundary(),this.build_center(),this.rebuild_faces(e),this.build_geometry()}subdivide(){var e=[],t=[];for(const o in this.voxels){const a=this.voxels[o],u=this.faces[o],l=[a[0]*2,a[1]*2,a[2]*2];e.push([l[0],l[1],l[2]],[l[0]+1,l[1],l[2]],[l[0],l[1]+1,l[2]],[l[0]+1,l[1]+1,l[2]],[l[0],l[1],l[2]+1],[l[0]+1,l[1],l[2]+1],[l[0],l[1]+1,l[2]+1],[l[0]+1,l[1]+1,l[2]+1]);for(var n in j){var r=Array(6).fill(0);for(var s in j[n])j[n][s]==1&&u[s]==1&&(r[s]=1);t.push(r)}}this.voxels=e,this.faces=t,this.build_boundary(),this.build_center(),this.build_geometry()}remove(...e){for(const n of e){if(this.voxels.length<=1)break;for(var t=0;t<this.voxels.length;t++)if(this.voxels[t][0]==n[0]&&this.voxels[t][1]==n[1]&&this.voxels[t][2]==n[2]){this.voxels.splice(t,1),this.faces.splice(t,1);break}}this.build_boundary(),this.build_center(),this.rebuild_remove_faces(e),this.build_geometry()}get_plane_color(e,t){var n=[];for(const a in this.pick_meta){const u=this.faces[a];for(var r=0,s=0;s<u.length;s++){if(u[s]==0){r+=1;continue}if(e.includes(a))if(r==t)for(var o=0;o<4;o++)n.push(1,.6,.6,1);else for(var o=0;o<4;o++)n.push(1,.9,.9,1);else for(var o=0;o<4;o++)n.push(1,1,1,1);r+=1}}return n}get_plane(e,t){var n=[];for(const o in this.voxels){const a=this.voxels[o];var r=!0;for(const u in t)if(t[u]!=0&&e[u]!=a[u]){r=!1;break}if(r){var s=this.voxels[o].map((u,l)=>u+t[l]);this.voxels.some(u=>u[0]==s[0]&&u[1]==s[1]&&u[2]==s[2])||n.push(o)}}return n}get_contiguous(e,t,n){var r=[];const s=this.voxels,o=new Set;function a(u){for(const h of e){const d=s[h];var l=!0;for(const p in n)if(n[p]!=0){if(u[p]!=d[p]){l=!1;break}}else if(Math.abs(u[p]-d[p])>1){l=!1;break}if(l){var f=s[h].map((p,g)=>p+n[g]),c=`${f[0]},${f[1]},${f[2]}`;o.has(c)||(o.add(c),r.push(h),a(s[h]))}}}return a(t),r}get_vertical_line(e,t,n){var r=[];for(const u in this.voxels){const l=this.voxels[u];var s=!0,o=-1;for(const f in t)if(t[f]!=0&&(o=f,e[f]!=l[f])){s=!1;break}if(o==0){for(const f in t)if(t[f]==0&&e[f]!=l[f]&&f==2){s=!1;break}}else if(o==2){for(const f in t)if(t[f]==0&&e[f]!=l[f]&&f==0){s=!1;break}}else if(o==1){for(const f in t)if(t[f]==0&&e[f]!=l[f]&&f==0){s=!1;break}}else s=!1;if(s){var a=this.voxels[u].map((f,c)=>f+t[c]);this.voxels.some(f=>f[0]==a[0]&&f[1]==a[1]&&f[2]==a[2])||r.push(u)}}return r}get_horizontal_line(e,t,n){var r=[];for(const u in this.voxels){const l=this.voxels[u];var s=!0,o=-1;for(const f in t)if(t[f]!=0){if(o=f,e[f]!=l[f]){s=!1;break}}else if(e[f]!=l[f]&&f==1){s=!1;break}if(o==1){for(const f in t)if(t[f]==0&&e[f]!=l[f]&&f==2){s=!1;break}}if(s){var a=this.voxels[u].map((f,c)=>f+t[c]);this.voxels.some(f=>f[0]==a[0]&&f[1]==a[1]&&f[2]==a[2])||r.push(u)}}return r}highlight_plane(e,t,n,r){var s=ne(e),o=[],a=0;for(const h in this.pick_meta){const d=this.faces[h],p=this.pick_meta[h];if(s>=p.start&&s<p.end)for(var u=0,l=0;l<d.length;l++){if(d[l]==0){u+=1;continue}if(s==a){var f;switch(n){case"Plane":f=this.get_plane(this.voxels[h],M[u]);break;case"Horizontal line":f=this.get_horizontal_line(this.voxels[h],M[u]);break;case"Vertical line":f=this.get_vertical_line(this.voxels[h],M[u]);break}return r&&(f=this.get_contiguous(f,this.voxels[h],M[u])),t({voxel:f.map(g=>this.voxels[g]),direction:M[u],index:h}),this.get_plane_color(f,u)}u+=1,a+=1}else for(var l=0;l<d.length;l++)if(d[l]!=0){for(var c=0;c<4;c++)o.push(1,1,1,1);a+=1}}return o}get_highlight(e,t){var n=ne(e),r=[],s=0;for(const l in this.pick_meta){const f=this.faces[l],c=this.pick_meta[l];if(n>=c.start&&n<c.end)for(var o=0,a=0;a<f.length;a++){if(f[a]==0){o+=1;continue}if(n==s){t({voxel:[this.voxels[l]],direction:M[o],index:l});for(var u=0;u<4;u++)r.push(1,.6,.6,1)}else for(var u=0;u<4;u++)r.push(1,.9,.9,1);o+=1,s+=1}else for(var a=0;a<f.length;a++)if(f[a]!=0){for(var u=0;u<4;u++)r.push(1,1,1,1);s+=1}}return r}rebuild_faces(e){const t=new Array(e.length).fill(0).map(s=>[1,1,1,1,1,1]);for(var n=0;n<e.length;n++)for(var r=0;r<this.faces.length;r++)O(e[n],this.voxels[r])&&(t[n][4]=0,this.faces[r][5]=0),H(e[n],this.voxels[r])&&(t[n][5]=0,this.faces[r][4]=0),Y(e[n],this.voxels[r])&&(t[n][2]=0,this.faces[r][3]=0),X(e[n],this.voxels[r])&&(t[n][3]=0,this.faces[r][2]=0),G(e[n],this.voxels[r])&&(t[n][0]=0,this.faces[r][1]=0),W(e[n],this.voxels[r])&&(t[n][1]=0,this.faces[r][0]=0);for(var n=0;n<e.length;n++)for(var r=n+1;n<e.length&&!(r>=e.length);n++)O(e[n],e[r])&&(t[n][4]=0,t[r][5]=0),H(e[n],e[r])&&(t[n][5]=0,t[r][4]=0),Y(e[n],e[r])&&(t[n][2]=0,t[r][3]=0),X(e[n],e[r])&&(t[n][3]=0,t[r][2]=0),G(e[n],e[r])&&(t[n][0]=0,t[r][1]=0),W(e[n],e[r])&&(t[n][1]=0,t[r][0]=0);this.faces.push(...t)}rebuild_remove_faces(e){for(var t=0;t<e.length;t++)for(var n=0;n<this.voxels.length;n++)O(e[t],this.voxels[n])&&(this.faces[t][4]=1,this.faces[n][5]=1),H(e[t],this.voxels[n])&&(this.faces[t][5]=1,this.faces[n][4]=1),Y(e[t],this.voxels[n])&&(this.faces[t][2]=1,this.faces[n][3]=1),X(e[t],this.voxels[n])&&(this.faces[t][3]=1,this.faces[n][2]=1),G(e[t],this.voxels[n])&&(this.faces[t][0]=1,this.faces[n][1]=1),W(e[t],this.voxels[n])&&(this.faces[t][1]=1,this.faces[n][0]=1)}build_faces(){const e=this.voxels,t=new Array(e.length).fill(0).map(s=>[1,1,1,1,1,1]);for(var n=0;n<e.length;n++)for(var r=n+1;r<e.length;r++)O(e[n],e[r])&&(t[n][4]=0,t[r][5]=0),H(e[n],e[r])&&(t[n][5]=0,t[r][4]=0),Y(e[n],e[r])&&(t[n][2]=0,t[r][3]=0),X(e[n],e[r])&&(t[n][3]=0,t[r][2]=0),G(e[n],e[r])&&(t[n][0]=0,t[r][1]=0),W(e[n],e[r])&&(t[n][1]=0,t[r][0]=0);this.faces=t}build_center(){const e=this.boundary;this.center=e[0].map((t,n)=>t+e[1][n])}build_boundary(){const e=this.voxels;for(var t=e[0],n=e[0],r=1;r<e.length;r++)t=t.map((s,o)=>Math.min(s,e[r][o])),n=n.map((s,o)=>Math.max(s,e[r][o]));this.boundary=[t,n]}}class ve{constructor(e,t,n){this.gl=e,this.program=t,this.canvas=n,this.attribute_matrix_4_mat_float=U((r,s)=>{var o=e.getUniformLocation(this.program,r);e.uniformMatrix4fv(o,!1,s)}),this.uniform_float=U((r,s)=>{var o=e.getUniformLocation(this.program,r);e.uniform1f(o,s)}),this.uniform_4_float=U((r,s)=>{var o=e.getUniformLocation(this.program,r);e.uniform4f(o,s[0],s[1],s[2],s[3])}),this.uniform_3_float=U((r,s)=>{var o=e.getUniformLocation(this.program,r);e.uniform3f(o,s[0],s[1],s[2])}),this.attribute_matrix_3_float=U((r,s)=>{var o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(s),e.STATIC_DRAW);var a=e.getAttribLocation(this.program,r);e.vertexAttribPointer(a,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(a)}),this.attribute_matrix_4_float=U((r,s)=>{var o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(s),e.STATIC_DRAW);var a=e.getAttribLocation(this.program,r);e.vertexAttribPointer(a,4,e.FLOAT,!1,0,0),e.enableVertexAttribArray(a)})}set face(e){this.faces=e}buffer(e){const t=this.gl,n=this.canvas,r=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,r);var s=t.createRenderbuffer();t.bindRenderbuffer(t.RENDERBUFFER,s),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_COMPONENT16,n.width,n.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,s);const o=t.createTexture();return t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,n.width,n.height,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),e(),t.bindFramebuffer(t.FRAMEBUFFER,null),o}getPixel(e,t){const n=this.gl,r=new Uint8Array(4);return n.readPixels(e,t,1,1,n.RGBA,n.UNSIGNED_BYTE,r),r}drawSolid(e){const t=this.gl;if(!e){if(this.faces==null)throw"No faces defined";e=this.faces}var n=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(e),t.STATIC_DRAW),t.getParameter(t.ALIASED_LINE_WIDTH_RANGE),t.drawElements(t.TRIANGLES,e.length,t.UNSIGNED_SHORT,0)}drawLines(e){const t=this.gl;if(!e){if(this.faces==null)throw"No faces defined";e=this.faces}var n=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(e),t.STATIC_DRAW),t.getParameter(t.ALIASED_LINE_WIDTH_RANGE),t.drawElements(t.LINES,e.length,t.UNSIGNED_SHORT,0)}}function U(i){return new Proxy({},{set:function(e,t,n){return i(t,n),!0}})}function be(i,e,t){const n=i.getContext("webgl2",{antialias:!0}),r=n.createProgram(),s=n.createShader(n.FRAGMENT_SHADER);n.shaderSource(s,t),n.compileShader(s),n.attachShader(r,s);const o=n.createShader(n.VERTEX_SHADER);return n.shaderSource(o,e),n.compileShader(o),n.attachShader(r,o),n.linkProgram(r),n.useProgram(r),[n,new ve(n,r,i)]}var re=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var i=0,e=arguments.length;e--;)i+=arguments[e]*arguments[e];return Math.sqrt(i)});function ye(){var i=new re(16);return re!=Float32Array&&(i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0),i[0]=1,i[5]=1,i[10]=1,i[15]=1,i}function xe(i,e){if(i===e){var t=e[1],n=e[2],r=e[3],s=e[6],o=e[7],a=e[11];i[1]=e[4],i[2]=e[8],i[3]=e[12],i[4]=t,i[6]=e[9],i[7]=e[13],i[8]=n,i[9]=s,i[11]=e[14],i[12]=r,i[13]=o,i[14]=a}else i[0]=e[0],i[1]=e[4],i[2]=e[8],i[3]=e[12],i[4]=e[1],i[5]=e[5],i[6]=e[9],i[7]=e[13],i[8]=e[2],i[9]=e[6],i[10]=e[10],i[11]=e[14],i[12]=e[3],i[13]=e[7],i[14]=e[11],i[15]=e[15];return i}function ge(i,e){var t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],u=e[6],l=e[7],f=e[8],c=e[9],h=e[10],d=e[11],p=e[12],g=e[13],F=e[14],A=e[15],T=t*a-n*o,w=t*u-r*o,L=t*l-s*o,S=n*u-r*a,D=n*l-s*a,$=r*l-s*u,I=f*g-c*p,B=f*F-h*p,_=f*A-d*p,E=c*F-h*g,m=c*A-d*g,b=h*A-d*F,v=T*b-w*m+L*E+S*_-D*B+$*I;return v?(v=1/v,i[0]=(a*b-u*m+l*E)*v,i[1]=(r*m-n*b-s*E)*v,i[2]=(g*$-F*D+A*S)*v,i[3]=(h*D-c*$-d*S)*v,i[4]=(u*_-o*b-l*B)*v,i[5]=(t*b-r*_+s*B)*v,i[6]=(F*L-p*$-A*w)*v,i[7]=(f*$-h*L+d*w)*v,i[8]=(o*m-a*_+l*I)*v,i[9]=(n*_-t*m-s*I)*v,i[10]=(p*D-g*L+A*T)*v,i[11]=(c*L-f*D-d*T)*v,i[12]=(a*B-o*E-u*I)*v,i[13]=(t*E-n*B+r*I)*v,i[14]=(g*w-p*S-F*T)*v,i[15]=(f*S-c*w+h*T)*v,i):null}function Ee(i,e,t,n){function r(_,E,m,b){var v=Math.tan(_*.5*Math.PI/180);return[.5/v,0,0,0,0,.5*E/v,0,0,0,0,-(b+m)/(b-m),-1,0,0,-2*b*m/(b-m),0]}var s=r(40,i.width/i.height,1,1e3),o=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],a=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];const u=ye();ge(u,a),xe(u,u),t.viewport(0,0,i.width,i.height),e.attribute_matrix_4_mat_float.uNormalMatrix=u,a[14]=a[14]-6;var l=0,f=!1,c,h,d=0,p=0,g=function(_){if(!(n()&&_.button!=1))return f=!0,c=_.pageX,h=_.pageY,_.preventDefault(),!1},F=function(_){f=!1};const A={x:0,y:0};var T=function(_){const E=i.__element.getBoundingClientRect();if(A.x=(_.clientX-E.left)*t.canvas.width/t.canvas.clientWidth,A.y=t.canvas.height-(_.clientY-E.top)*t.canvas.height/t.canvas.clientHeight-1,!f)return!1;d=(_.pageX-c)*2*Math.PI/i.width,p=(_.pageY-h)*2*Math.PI/i.height,$+=d,I+=p,c=_.pageX,h=_.pageY,_.preventDefault()};i.$on("mousedown",g),i.$on("mouseup",F),i.$on("mouseout",F),i.$on("mousemove",T);var w=function(_){_.preventDefault();var E=_.wheelDelta?_.wheelDelta/40:_.detail?-_.detail:0,m=1.3;return E&&L(E<0?1*m:1/m),_.preventDefault()&&!1};function L(_){a[14]*=_}i.$on("wheel",w);function S(_,E){var m=Math.cos(E),b=Math.sin(E),v=_[1],Q=_[5],Z=_[9];_[1]=_[1]*m-_[2]*b,_[5]=_[5]*m-_[6]*b,_[9]=_[9]*m-_[10]*b,_[2]=_[2]*m+v*b,_[6]=_[6]*m+Q*b,_[10]=_[10]*m+Z*b}function D(_,E){var m=Math.cos(E),b=Math.sin(E),v=_[0],Q=_[4],Z=_[8];_[0]=m*_[0]+b*_[2],_[4]=m*_[4]+b*_[6],_[8]=m*_[8]+b*_[10],_[2]=m*_[2]-b*v,_[6]=m*_[6]-b*Q,_[10]=m*_[10]-b*Z}var $=.8,I=.8;function B(){f||(d*=l,p*=l,$+=d,I+=p),o[0]=1,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=1,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=1,o[11]=0,o[12]=0,o[13]=0,o[14]=0,o[15]=1,I=Math.max(-Math.PI/2,Math.min(Math.PI/2,I)),D(o,$),S(o,I),e.attribute_matrix_4_mat_float.projection_matrix=s,e.attribute_matrix_4_mat_float.view_matrix=a,e.attribute_matrix_4_mat_float.model_matrix=o}return{update:B,mouse:A,zoom:L}}function Re(i){var e=0;function t(n){n*=.001;const r=n-e;e=n;const s=1/r;i(s.toFixed(1)),requestAnimationFrame(t)}t()}function ee(i,e){var t=[];const n=ie({name:"Point"});for(const r of i){const s=R("button",{class:{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>"button"+(n.name==r.name?" button-selected":""),elements:[typeof n<"u"?n:void 0,typeof name<"u"?name:void 0,typeof r<"u"?r:void 0,typeof name<"u"?name:void 0]}},{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>r.name,elements:[typeof r<"u"?r:void 0,typeof name<"u"?name:void 0]});s.$on("click",()=>{n.name=r.name,e(r.name)}),t.push(s)}return t}function k(i,e){const t=ie({value:!0});var n=R("button",{class:{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>"button"+(t.value?" button-selected":""),elements:[typeof t<"u"?t:void 0,typeof value<"u"?value:void 0]}},{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>i,elements:[typeof i<"u"?i:void 0]});return n.$on("click",()=>{t.value=!t.value,e(t.value)}),n}function N(i,e){var t=R("button",{class:"button"},{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>i,elements:[typeof i<"u"?i:void 0]});return t.$on("click",()=>{e()}),t}var V=null,q=null,J=null;const te=[{name:"Point"},{name:"Plane"},{name:"Horizontal line"},{name:"Vertical line"}];var C="Point",K=!0,z=!0;const P=ae(),fe=ae(),Fe=R("div",{class:"main"},R("canvas",{ref:P}),R("div",{class:"info"},R("p",null,"FPS: ",R("span",{ref:fe})),R("p",null,R("h3",null,"Tool"),{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>ee(te,i=>C=i),elements:[typeof ee<"u"?ee:void 0,typeof te<"u"?te:void 0,typeof x<"u"?x:void 0,typeof C<"u"?C:void 0,typeof x<"u"?x:void 0]}),R("p",null,R("h3",null,"Tool options"),{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>k("Contiguous",i=>K=i),elements:[typeof k<"u"?k:void 0,typeof x<"u"?x:void 0,typeof K<"u"?K:void 0,typeof x<"u"?x:void 0]}),R("p",null,R("h3",null,"View"),{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>k("Wireframe",i=>z=i),elements:[typeof k<"u"?k:void 0,typeof x<"u"?x:void 0,typeof z<"u"?z:void 0,typeof x<"u"?x:void 0]}),R("p",null,R("h3",null,"Actions"),{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>N("Subdivide",()=>V()),elements:[typeof N<"u"?N:void 0,typeof V<"u"?V:void 0]}),R("p",null,R("h3",null,"Persistence"),{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>N("Save",()=>q()),elements:[typeof N<"u"?N:void 0,typeof q<"u"?q:void 0]},{key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>N("Load",()=>J()),elements:[typeof N<"u"?N:void 0,typeof J<"u"?J:void 0]})));P.width=800;P.height=800;Fe.$parent(document.body);var y=new me;y.init();async function Ae(){var i=await fetch("./shader.vert").then(f=>f.text()),e=await fetch("./shader.frag").then(f=>f.text()),[t,n]=be(P.__element,i,e);n.antialias=!1,n.uniform_4_float.color_overlay=[0,0,0,1],q=()=>{var f=JSON.stringify(y.voxels),c=new Blob([f],{type:"application/json"}),h=URL.createObjectURL(c),d=document.createElement("a");d.download="voxel.json",d.href=h,d.textContent="Download",d.click(),d.remove()},J=async()=>{var f=document.createElement("input");f.type="file",f.onchange=c=>{var h=c.target.files[0],d=new FileReader;d.onload=function(p){var g=p.target.result;y.voxels=JSON.parse(g),y.init();var[F,L]=y.boundary,A=F[0]-L[0],T=F[1]-L[1],w=F[2]-L[2],L=Math.abs(Math.max(A,T,w));console.log(L),u(L),n.attribute_matrix_3_float.normal=y.geometry_normals,n.attribute_matrix_3_float.position=y.geometry_vertexes},d.readAsText(h)},f.click(),f.remove()};var r=null,s=null;P.$on("mousedown",f=>{f.button==1&&f.preventDefault(),s=r}),P.$on("contextmenu",f=>(f.preventDefault(),!1)),P.$on("mouseup",f=>{r!=null&&s!=null&&r.index==s.index&&(f.button==0?(y.add(...r.voxel.map(c=>c.map((h,d)=>h+r.direction[d]))),n.attribute_matrix_3_float.normal=y.geometry_normals,n.attribute_matrix_3_float.position=y.geometry_vertexes):f.button==2&&(y.remove(...r.voxel),n.attribute_matrix_3_float.normal=y.geometry_normals,n.attribute_matrix_3_float.position=y.geometry_vertexes))});const{update:o,mouse:a,zoom:u}=Ee(P,n,t,()=>r);V=()=>{y.subdivide(),n.attribute_matrix_3_float.normal=y.geometry_normals,n.attribute_matrix_3_float.position=y.geometry_vertexes,u(2)};function l(){t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.enable(t.CULL_FACE),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT)}Re(f=>{fe.$html({key:"e0b8fc2b-fc7e-4786-bc05-b85187a8d065",expression:()=>f,elements:[typeof f<"u"?f:void 0]}),o(),n.attribute_matrix_3_float.normal=y.geometry_normals,n.attribute_matrix_3_float.position=y.geometry_vertexes;var c=null;n.buffer(()=>{t.clearColor(0,0,0,0),n.uniform_float.disable_lighting=1,l(),n.attribute_matrix_4_float.color=y.pick_map,n.drawSolid(y.geometry_indexes),c=n.getPixel(a.x,a.y)}),n.uniform_float.disable_lighting=0,t.clearColor(.5,.5,.5,.9),t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(1,1),l(),r=null,C=="Point"?n.attribute_matrix_4_float.color=y.get_highlight(c,h=>r=h):n.attribute_matrix_4_float.color=y.highlight_plane(c,h=>r=h,C,K),n.drawSolid(y.geometry_indexes),t.disable(t.POLYGON_OFFSET_FILL),z&&(n.uniform_float.enable_color_overlay=1,n.drawLines(y.geometry_edge_index),n.uniform_float.enable_color_overlay=0)})}Ae();
