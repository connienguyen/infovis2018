// https://d3js.org/d3-scale-chromatic/ Version 0.3.0. Copyright 2016 Mike Bostock.
!function(f,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("d3-interpolate")):"function"==typeof define&&define.amd?define(["exports","d3-interpolate"],e):e(f.d3=f.d3||{},f.d3)}(this,function(f,e){"use strict";function d(f){return f.match(/.{6}/g).map(function(f){return"#"+f})}function c(f){return e.interpolateRgbBasis(d(f))}var a=d("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666"),b=d("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666"),t=d("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"),n=d("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2"),r=d("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc"),i=d("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999"),o=d("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3"),l=d("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f"),p=c("5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"),u=c("40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"),s=c("8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"),B=c("7f3b08b35806e08214fdb863fee0b6f7f7f7d8daebb2abd28073ac5427882d004b"),P=c("67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"),m=c("67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"),G=c("a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"),R=c("a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"),h=c("9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"),Y=c("f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"),y=c("f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"),O=c("f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"),S=c("fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"),g=c("fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"),x=c("fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"),j=c("f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"),v=c("fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"),_=c("ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"),k=c("ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"),q=c("ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"),A=c("ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"),D=c("f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"),M=c("f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"),w=c("fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"),z=c("fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"),C=c("fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"),E=c("fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704");f.schemeAccent=a,f.schemeDark2=b,f.schemePaired=t,f.schemePastel1=n,f.schemePastel2=r,f.schemeSet1=i,f.schemeSet2=o,f.schemeSet3=l,f.interpolateBrBG=p,f.interpolatePRGn=u,f.interpolatePiYG=s,f.interpolatePuOr=B,f.interpolateRdBu=P,f.interpolateRdGy=m,f.interpolateRdYlBu=G,f.interpolateRdYlGn=R,f.interpolateSpectral=h,f.interpolateBuGn=Y,f.interpolateBuPu=y,f.interpolateGnBu=O,f.interpolateOrRd=S,f.interpolatePuBuGn=g,f.interpolatePuBu=x,f.interpolatePuRd=j,f.interpolateRdPu=v,f.interpolateYlGnBu=_,f.interpolateYlGn=k,f.interpolateYlOrBr=q,f.interpolateYlOrRd=A,f.interpolateBlues=D,f.interpolateGreens=M,f.interpolateGreys=w,f.interpolatePurples=z,f.interpolateReds=C,f.interpolateOranges=E,Object.defineProperty(f,"__esModule",{value:!0})});