import { describe, expect, test } from 'bun:test'
import { hexToBytes } from '@noble/hashes/utils'
import { bech32, bech32m } from '@scure/base'
import { decodeZecAddress, encodeZecAddress } from './zec.js'

describe.each([
  {
    // P2PKH Transparent Address
    text: 't1b2ArRwLq6KbdJFzJVYPxgUVT1d9QuBzTf',
    hex: '76a914bc18e286d40706de62928155d6167bf30719857888ac',
  },
  {
    // P2SH Transparent Address
    text: 't3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd',
    hex: 'a9147d46a730d31f97b1930d3368a967c309bd4d136a87',
  },
  {
    // Sapling Payment Address (shielded address)
    text: 'zs1wkejr23wqa9ptpvv73ch3wr96lh8gnyx3689skmyttljy4nyfj69eyclukwkxrhr3rrkgxvnur0',
    hex: '75b321aa2e074a15858cf47178b865d7ee744c868e8e585b645aff2256644cb45c931fe59d630ee388c764',
  },
  {
    // Unified Address (ZIP 316 Revision 0), P2PKH + Sapling
    // zcash-test-vectors unified_address.json #0
    text: 'u1l8xunezsvhq8fgzfl7404m450nwnd76zshscn6nfys7vyz2ywyh4cc5daaq0c7q2su5lqfh23sp7fkf3kt27ve5948mzpfdvckzaect2jtte308mkwlycj2u0eac077wu70vqcetkxf',
    hex: 'f9cdc9e45065c074a049ffaafaeeb47cdd36fb4285e189ea69243cc20944712f5c628def40fc780a8729f026ea8c03e4d931b2d5e66685a9f620a5acc585dce16a92d798bcfbb3be4c495c7e7b87fbcee79ec0',
  },
  {
    // Unified Address (ZIP 316 Revision 0), P2PKH + Sapling + Orchard
    // zcash-test-vectors unified_address.json #3
    text: 'u1pg2aaph7jp8rpf6yhsza25722sg5fcn3vaca6ze27hqjw7jvvhhuxkpcg0ge9xh6drsgdkda8qjq5chpehkcpxf87rnjryjqwymdheptpvnljqqrjqzjwkc2ma6hcq666kgwfytxwac8eyex6ndgr6ezte66706e3vaqrd25dzvzkc69kw0jgywtd0cmq52q5lkw6uh7hyvzjse8ksx',
    hex: '0a15de86fe904e30a744bc05d553ca541144e2716771dd0b2af5c1277a4c65efc3583843d1929afa68e086d9bd38240a62e1cded809927f0e72192407136dbe42b0b27f900039005275b0adf757c035ad590e4916677707c9326d4da81eb225e75af3f598b3a01b55468982b6345b39f2411cb6bf1b05140a7eced72feb91829',
  },
  {
    // Unified Address (ZIP 316 Revision 0), Sapling + Orchard
    // zcash-test-vectors unified_address.json #6
    text: 'u1ay3aawlldjrmxqnjf5medr5ma6p3acnet464ht8lmwplq5cd3ugytcmlf96rrmtgwldc75x94qn4n8pgen36y8tywlq6yjk7lkf3fa8wzjrav8z2xpxqnrnmjxh8tmz6jhfh425t7f3vy6p4pd3zmqayq49efl2c4xydc0gszg660q9p',
    hex: 'e923debbff6c87b302724d37968e9bee831ee2795d755bacffdb83f0530d8f1045e37f497431ed6877db8f50c5a827599c28cce3a21d6477c1a24adefd9314f4ee1487d61c4a304c098e7b91ae75ec5a95d37aaa8bf262c268350b622d83a4054b94fd58a988dc3d1012',
  },
  {
    // Unified Address (ZIP 316 Revision 0), Sapling + unknown typecode
    // zcash-test-vectors unified_address.json #21
    text: 'u1sem2gcey0emntrvxyjv8hyhq0w5fr4sxaj3cppgrfqgg6laydh8m78gy2cw2p54zzak3alnnsx4xjuhazpkrfcd90wl0c7ldj6y095hh5j6j2evry9vg5jqp4dyqpwqeryu7pes4sxyyyqwn6egs5daxk4473v9xpgzrwv5n0tvs93nlj4xpphq4vs2w8um9ph7zkte08t7fa509mnrt9apuhr22xq34mp2svjnq6rvfn0hg6lkehxtlj39vgjxjlkjfhx8rw2f02ckq8k5szcxsnhkgr2cqlmf2udl2gqdqr5t6',
    hex: '8676a463247e77358d8624987b92e07ba891d606eca380850348108d7fa46dcfbf1d04561ca0d2a2176d1efe7381aa6972fd106c34e1a57bbefc7bed9688f2d2f7a4b525658321588a4801ab4800b8191939e0e61581884201d3d6510a37a6b56be8b0a60a043732937ad902c67f954c10dc156414e3f3650dfc2b2f2f3afc9ed1e5dcc6b2f43cb8d4a30235d855064a60d0d899bee8d7ed9b997f944ac448d2fda49b98e37292f562c03da90160d09dec81ab00fed2ae37ea40',
  },
  {
    // Unified Address (ZIP 316 Revision 0), Orchard only
    // zcash-test-vectors unified_address.json #27
    text: 'u1ddnjsdcpm36r6aq79n3s68shjweksnmwtdltrh046s8m6xcws9ygyawalxx8n6hg6vegk0wh8zjnafxgh6msppjsljvyt0ynece3lvm0',
    hex: '6b67283701dc743d741e2ce30d1e1793b3684f6e5b7eb1ddf5d40fbd1b0e81488275ddf98c79eae8d3328b3dd738a53ea4c8beb7008650fc9845bc93ce',
  },
  {
    // Unified Address (ZIP 316 Revision 0), Sapling only
    // zcash-test-vectors unified_address.json #45
    text: 'u187vrwl4ampyxd5m6aj38n4ndkmj8v6gs97hkt23aps3sn5k89a0gk2smluexgdprcrtm56ezc5c7tjwlrnnl79tjtrxmqd42c5mpyz7g',
    hex: '3f98377ebdd84866d37aeca279d66db6e47669102faf65aa3d0c2309d2c72f5e8b2a1bff32643423c0d7ba6b22c531e5c9df1ce7ff157258cdb036aac5',
  },
  {
    // TEX Address (ZIP 320), zcash-test-vectors zip_0320.json, same key as t1V9mnyk5Z5cTNMCkLbaDwSskgJZucTLdgW
    text: 'tex10wur2u9clts5dcpu2vc6qg93uzyj7cca2xm732',
    hex: '7bb83570b8fae146e03c5331a020b1e0892f631d',
  },
  {
    // TEX Address (ZIP 320), zcash-test-vectors zip_0320.json, same key as t1LZdE42PAt1wREUv1YMYRFwJDPHPW8toLL
    text: 'tex1rkq7seu3cukjjtusde7q8xnjne93laluyvdxu7',
    hex: '1d81e86791c72d292f906e7c039a729e4b1ff7fc',
  },
])('zec address', ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeZecAddress(hexToBytes(hex))).toEqual(text)
  })
  test(`decode: ${text}`, () => {
    expect(decodeZecAddress(text)).toEqual(hexToBytes(hex))
  })
})

describe.each([
  {
    // unknown data typecode 0x04 is ignored
    text: 'u1h2amef4qugy40zykg2t6s46d0ukd8rw2mnk832x2pgfyz8rp3zej87ck7ttn2jsd6ssk5l58hymxp24zl9mjqgyzqvsjzhmtrl4yfcwvyqsker8zfegru90u4ke',
  },
  {
    // non-MUST-understand metadata 0xC0 is ignored
    text: 'u13l6yyh8j26r04umpjha5x9js3eap67nxcrtplergv4nkm2tfyykd4ejup0p786lrp3h39djvtg4d8sg50ct96d30a79p8cvz5v7462tp3g35lc',
  },
  {
    // P2PKH + unknown typecode: accepted, as librustzcash counts unknown items as non-transparent
    text: 'u1q2y3hzpp9jhq8s6ha5s95v4tmlzglrkjckn75zf44eqa4ut6evsf5gvfeappprm5naqlq4nx6mrvq600fhal9p4gu7ymlzefke9a0mqtan6q2g82pc7qsfx3ww',
  },
])('zec unified address round trip', ({ text }) => {
  test(`round trip: ${text}`, () => {
    expect(encodeZecAddress(decodeZecAddress(text))).toEqual(text)
  })
})

describe.each([
  {
    // TEX encoded with Bech32 instead of Bech32m
    text: 'tex10wur2u9clts5dcpu2vc6qg93uzyj7ccal6tj5g',
  },
  {
    // TEX payload of 21 bytes
    text: 'tex10wur2u9clts5dcpu2vc6qg93uzyj7ccaqq85ghms',
  },
  {
    // receivers in priority order instead of typecode order
    text: 'u1p4q5klmwntnewda2gyylsffc40sakc2ksh9cl9py7dz5wrcp9js9njqymxtwtjqqj3y0dvmreg0g04229nv7qpmvp80r7tyq35qrp23m9tny2g4qqr22vt8f5ufmlcp2tszljdxhfxtqchmhm22rjjthg680lz5z9qugqxgv8qwz9xng',
  },
  {
    // P2PKH after Sapling
    text: 'u14wkj4dd3q67keuwu8wumk4ryms2k2cjvtru7wkcc8fvemutv96hnrdulucrkft8978dtawaqhxm3tqhtlln28a66dn0upc9qagtzp94kv9tvnheyxmdxrzqd5567ekv9l3f66slar98xwe0y7xq6q92ma6n2whdfhg9mw9wp5skzc5vw8a85e4plxhp9u4jftmmtxqw5u54zwvh8e68',
  },
  {
    // Orchard receiver twice
    text: 'u1s066yagjuvr5yer5xavx5jw2rqm8zwlv8y4447wqh3ygym5wdxv5s6mmh6qzlukllkskhfnn65mmkhwyu5h9tekvdmhc75859g9fp5zv22zalewnuuaw6aa33qq4keyn8plfqjghxdjehl97hl8rr2qx6uc8dkjcns0u4v948qlcvesdwdrmzw6stf29sanggzjn4l20z2nuufllka2',
  },
  {
    // P2PKH and P2SH together
    text: 'u1h7q8m3yaxuj562a6sw3uam92lmvx0fca3dqlmnd76xacxak9c7wky3nue53m8tfel4er483nhn6nnegfyhq64et7eek045lxpla4uzmkrx08rwqdewd85hnl3a08ql9hy4y8n73ggraeqhgpfpll3l7nnglre647e2af70hylkn60s',
  },
  {
    // Revision 0 UA with only a P2PKH receiver
    text: 'u1hjw88a4ekkp5733fvt4hae9csn087eyt8fquvxc7qr8y8dr6h99qm6heg9zp248y68a',
  },
  {
    // only P2PKH plus ignorable metadata
    text: 'u1jqsuvnqwscvrggnjnksmc6duw6kxe8m2rsll2ekvduyjqdzt8l9xz6t34hn6ek9qnvayg0pc',
  },
  {
    // Revision 0 UA with expiry metadata
    text: 'u1kepdq2necce4kx6nex27junx0pxln735zcmp6jz9ah7pdjr787wsadmr5tqvx5kpl554syyuf8aksjqjru0hlfkry93cl649y48w4g9ysjjs93jl5s',
  },
  {
    // Orchard receiver of 42 bytes
    text: 'u1xe6su9sn4t5xaxar3jkhzhhtjt2kjcwqueydp5ctnvhu5wq7swxhc0v4aycg797240jmqku2s00p9pmaak750e5ukdz4aytfwpgrwy',
  },
  {
    // P2PKH receiver of 21 bytes
    text: 'u182a5nznxe0vstjwhsx9t8tyadhefduas9dttal6xsj9qs38hyzk2h4m0nvp9j7yuwk7qsayupnnhtwepcnx3khf827r4h6cr5zvfgefdcnjaeuld45098ejshcjnq59r7dh2kdqzufcjx',
  },
  {
    // Sapling receiver of 44 bytes
    text: 'u1run2nwvmws3y3dv0xvxepwj47nged29m8wtcmkrq4znfphk92uuvy62t04ym9fqpsg25gh09u039dzme6vac99g7d4x4earmeu5snqz53h',
  },
  {
    // mainnet HRP with testnet padding
    text: 'u1nqaarlf8ehmtateefnysz3a6mxvtl39cgvtmj68ngj9266vtk7efr936qp67cz4aywuy4cqss3pfu870hxmkruhmrzgetw2jq7dle6lvzrgsrckh2ugw4fehsyd7j66sy67x84hylx5rjg47qnkzztwf9zvce9v6je7ngd6j8mjh44knm2kj7u6c67nv20dk6hkhsfugd5t7j66tz9f',
  },
  {
    // trailing byte after the last item
    text: 'u1q0nwk74nkfpfu20y4s6v40t8xfpp6qca3mpv95da6mlcyy692wh8ssr2qf3t9tyw7ar2uguagtgkr4k23zhmy47q6wh3zggnpxt5efu5u28p9h5dcvl0jufamv2mmjvlpwgq339cdt62zfx595nqu2tadvrdlaspkf3z22xvhr4s2hpw9qw7levxd7vagucuyatdj8j3v5cycggvznskl',
  },
  {
    // item shorter than its length field
    text: 'u18m6rvavjspwpg5es7da83z9tjqf4gg9u4pc5s0rg4rfucu4g87dwfh0kvpgqn8rd409e6k2zlaqdytu6xmpw3lnn92y7js832v0',
  },
  {
    // non-canonical compactSize typecode
    text: 'u1c0qym4msx4gqe9w9s95nem9v6te6r5jv4nv2a7rt8de9nj3ezec9s40r858etj0vlcqwhznz0rdy8ysn9kfdhjleeenz4vf095j6qr7eyrg',
  },
  {
    // non-canonical compactSize length
    text: 'u1slz6pzhz0ta7054zlmfsetpshn2ahq9uu98k8de9nknwepvhrzzed0mwmwup5fquhxuxcns3g48duw4l37yv2r0n9d92jwc8wa0rs8h4wm3',
  },
  {
    // typecode above 0x2000000
    text: 'u1gctzcka2u8g459dtm4tqv7r8qdrhtp9ceu3zkucvls0q0jgal203pw9fgux7avmntqeha2ejs4873tn28pn3mz2edfch2wymdsveenlqtf2q6zeq58',
  },
  {
    // UA encoded with Bech32 instead of Bech32m
    text: 'u1pg2aaph7jp8rpf6yhsza25722sg5fcn3vaca6ze27hqjw7jvvhhuxkpcg0ge9xh6drsgdkda8qjq5chpehkcpxf87rnjryjqwymdheptpvnljqqrjqzjwkc2ma6hcq666kgwfytxwac8eyex6ndgr6ezte66706e3vaqrd25dzvzkc69kw0jgywtd0cmq52q5lkw6uh7hyvzj99h64y',
  },
  {
    // payload of 20 bytes, below the F4Jumble minimum of 38
    text: 'u1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqh66jke',
  },
  {
    // Sapling address with a 20-byte payload
    text: bech32.encode('zs', bech32.toWords(new Uint8Array(20))),
  },
  {
    // Revision 2 Unified Address (ZIP 316 Draft), not supported yet
    // zcash-test-vectors unified_address_r2.json
    text: 'zu1wpmyzjrdtsw2n0kgku0pr6raf7jhwe70e45ucfcruk9qrxv59fxegvrlwmqs8uydq57re5rm79eth5hu5hzcqetl39nphtyp74qu5prrpwy8kzqlxagwz24f2c3z0939mwt3cngyfrx5nyk270q4eaj5jqdqepadhq4n6kmf0cdca58t',
  },
])('zec invalid address', ({ text }) => {
  test(`decode: ${text}`, () => {
    expect(() => decodeZecAddress(text)).toThrow()
  })
})

describe('zec encode', () => {
  test('Sapling payload that looks like a P2SH script', () => {
    const source = new Uint8Array(43)
    source[0] = 0xa9
    source[42] = 0x87
    expect(decodeZecAddress(encodeZecAddress(source))).toEqual(source)
    expect(encodeZecAddress(source).startsWith('zs1')).toBe(true)
  })
  test('rejects bytes of no known length', () => {
    expect(() => encodeZecAddress(new Uint8Array(30))).toThrow()
  })
  test('rejects a Unified Address payload with only a transparent receiver', () => {
    const { words } = bech32m.decode(
      'u1hjw88a4ekkp5733fvt4hae9csn087eyt8fquvxc7qr8y8dr6h99qm6heg9zp248y68a',
    )
    const source = new Uint8Array(bech32m.fromWords(words))
    expect(() => encodeZecAddress(source)).toThrow()
  })
  test('rejects a corrupted Unified Address payload', () => {
    const source = decodeZecAddress(
      'u1pg2aaph7jp8rpf6yhsza25722sg5fcn3vaca6ze27hqjw7jvvhhuxkpcg0ge9xh6drsgdkda8qjq5chpehkcpxf87rnjryjqwymdheptpvnljqqrjqzjwkc2ma6hcq666kgwfytxwac8eyex6ndgr6ezte66706e3vaqrd25dzvzkc69kw0jgywtd0cmq52q5lkw6uh7hyvzjse8ksx',
    )
    source[source.length - 1] ^= 1
    expect(() => encodeZecAddress(source)).toThrow()
  })
})
