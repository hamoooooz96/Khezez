/* ==========================================================================
   KHEZEZ — site content
   Edit this file to change text, projects and images. No build step needed.

   IMAGES
   Each image is one string. Three formats are accepted:
     1. Adobe Portfolio CDN  'uuid|hash600|hash1200|hash1920|ratio'
        (the hashes are required by the CDN — copy them exactly)
     2. Any full URL         'https://…/photo.jpg|1.78'
     3. A local file         'assets/media/my-photo.jpg|1.5'
   The last value is the width / height ratio (1.78 = 16:9, 1.5 = 3:2).

   FILMS (optional, per project)
   films: ['https://player.vimeo.com/video/123456789'] — shown above the gallery.

   localMedia: set to true after running tools/download-images.command —
   the site will then load every image from assets/media/ instead of the CDN.
   ========================================================================== */

window.KHEZEZ = {
  localMedia: false,
  cdn: 'https://cdn.myportfolio.com/edb53d88-2a7a-4cc4-869f-a1807b83fe79/',

  name: 'Mohammed Khezez',
  short: 'Khezez',
  role: 'Creative Director & Cinematographer',
  city: 'Baghdad, Iraq',
  timezone: 'Asia/Baghdad',
  studio: 'Cave Studios',
  tagline: 'Wielding deep details and cinematic realism to craft visual identities and commercial experiences.',
  bio: 'Mohammed Khezez is a Creative Director and Cinematographer based in Baghdad, and the founder of Cave Studios — specializing in commercial video production, brand marketing and Cinematic Realism.',

  email: 'muhammedmajeed91@gmail.com',
  whatsapp: '+964 784 228 3370',
  whatsappLink: 'https://wa.me/9647842283370',

  services: [
    'Creative Direction',
    'Cinematography / DOP',
    'Commercial Video Production',
    'Commercial Photography',
    'Storyboarding',
    'Brand Marketing'
  ],

  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/khezez/' },
    { label: 'Vimeo', url: 'https://vimeo.com/user260271118' },
    { label: 'YouTube', url: 'https://www.youtube.com/@khezezpro' },
    { label: 'Behance', url: 'https://www.behance.net/khezez2' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mohammed-khezez-771130216/' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@khezez' },
    { label: 'X', url: 'https://x.com/khezez_x' },
    { label: 'Threads', url: 'https://www.threads.com/@khezez' },
    { label: 'Facebook', url: 'https://www.facebook.com/khezez/' },
    { label: 'Pinterest', url: 'https://www.pinterest.com/khezez_/' },
    { label: '500px', url: 'https://500px.com/p/muhammedmajeed91?view=photos' }
  ],

  /* Projects appear in this order everywhere on the site.
     cards: how many of the first images go into the 3D stack on the home page. */
  projects: [
    {
      "slug": "gilgamesh-university",
      "title": "Gilgamesh University",
      "subtitle": "Cinematic Stills",
      "category": "TVC Poster",
      "client": "Gilgamesh University",
      "year": "2026",
      "location": "Baghdad, Iraq",
      "lead": "TVC for Gilgamesh University.",
      "cards": 1,
      "images": [
        "assets/media/gilgamesh-university/024.webp|1.333",
        "1ffd9b40-035d-4cf6-8633-e47bbf7b356c|aedc64667b5b67dc04ae6c1f7c5ada6d|a20698209a30ae7bd88d465ff2cda584|9e9788a97934b3580830e43902d54330|1.78",
        "b6f5ce7c-04a3-42df-8a61-021b47959b8c|b799982d5c43cbbe74759fff5eb6b2ac|a7504d4869540c51a9f1b27406d61e5a|c7b1a91c53de0405f481523e2cf60a47|1.78",
        "935a09a9-b7b4-492e-92c8-68c1e479e931|9cf6751c5a66923ba92584da337426c2|55d850eb948001d84aa4a12dddc096ce|e2dc6510abcfb70aefa4b6a4c6c8542e|1.78",
        "526f5efd-6f1d-40e0-b77a-c416ed7bc166|845053f7eb73e9933ce794b46f2336a5|8a67a526060ee2965c048a3b6644e46f|a799c56211059c93f002e38a32b089cb|1.78",
        "9a440144-c45f-4fc9-990d-2ddd2476e52d|b1384ec495e0ad1563125fb63de69171|86372bb6a09bbede6b14da09f8a99f63|9f4f96bfbcbb65878ad57bcdfe051044|1.78",
        "4146bedc-777c-4768-a6bb-f862152fbf98|3e8e8b820e9cd0a8fc234e1d02deaa6d|b8ecb128d947dafaab877ab5bedb8e72|baaa53eecf8e66407f95c04750f28732|1.78",
        "b1854bad-026c-45fe-868d-b0e6c8eeeaf1|ec09223c34faed6b69ea9c29802fdd2a|4cd7b7259f571e7cd1e45548e2e8510c|1f5d29d69983cd90486e561393335e02|1.78",
        "a0197752-7d96-4435-b3d7-2984bff2b5e0|a7927da32521723c2bfd990fb8039b44|1bf78b4dd0a43a754d04b7a41ab3d3a2|7d4ba45e3763037b39064f4eca6e5624|1.78",
        "7d188b7c-71de-43fe-832e-3da9b7dae327|a9b7a1e85ba6e6a6f41b763f82f519a6|95771daf3295be7968382acd5f9fd447|424fc420dd549185601664d20710826e|1.78",
        "a972737e-3740-460b-819e-b9f789df4497|6fb2699268342daf6227a3b188ef3ae7|e55f7f83706adad0e98d1c064c2817ce|49083e5b60433d8c518da91c86c3e1d5|1.78",
        "bcdff663-9e61-44ef-9a49-da475dbc8921|99dd6d046a40564e271a11e7c008fb85|5150889f1e7be8daf4f97ae1a8e7315e|3306c98c2038288052e7516e0fb42fed|1.78",
        "638b935d-b18b-42f9-a053-2631264e33ee|3510782b321455583f2182fae63e1d24|1a26b32155877ef31940a2a64fb7925c|e24bf9f410be300c7596d33f52a8c1e4|1.78",
        "0765ad35-eaa4-412d-bdce-c374c75a7ee3|52b45cc968895622ac7e77f1d3e959a6|246d51fd35bc667d7c2dfd5acd17ded7|8508ea6c70ce5c5bb3c4f0628984a19a|1.78",
        "fa71d1e3-4bb6-40c0-9a95-c372aa9fafad|57fa0f757cc5619c3bb6c0bde857644f|c3e9a66830a7ea74c5af4c405fe26189|ceb7a3ec425a5e9b783c30366a9b6cfd|1.78"
      ]
    },
    {
      "slug": "sky-baghdad",
      "title": "Sky Baghdad",
      "subtitle": "Street Advertising",
      "category": "Outdoor",
      "client": "Sky Baghdad",
      "year": "2026",
      "location": "Baghdad, Iraq",
      "lead": "TVC poster and street poster ads for Sky Baghdad.",
      "films": [
        "https://www-ccv.adobe.io/v1/player/ccv/VM3Vf3xIExT/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View",
        "https://www-ccv.adobe.io/v1/player/ccv/G3ZBFhrRdMC/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View"
      ],
      "cards": 1,
      "images": [
        "7cfa0456-4de4-4bad-9230-64b241a7a4ec|ad709a381295934c827440f5edc7591f|9435b44cb17a750d2575591f39406702|e59e0b9d329a5f66344146a5ab61d6c6|1.78",
        "72e6fe79-01e5-4961-ad8e-aa7e9672a190|91f8eee2413617d0e62fad0e2895392a|0074ac467a3ea1f961567d566c63b276|58701630c26fac88cb1cafd7fdc221b2|1.791"
      ]
    },
    {
      "slug": "savana",
      "title": "Savana",
      "subtitle": "TVC Poster",
      "category": "TVC Poster",
      "client": "Savana",
      "year": "2026",
      "location": "Baghdad, Iraq",
      "lead": "Still photography for Savana.",
      "cards": 1,
      "images": [
        "assets/media/savana/004.webp|1.813",
        "assets/media/savana/006.webp|1.813",
        "assets/media/savana/009.webp|1.813",
        "assets/media/savana/011.webp|1.813",
        "assets/media/savana/014.webp|1.813",
        "assets/media/savana/016.webp|1.813",
        "assets/media/savana/018.webp|1.813",
        "assets/media/savana/021.webp|1.813"
      ]
    },
    {
      "slug": "fiber-x-tvc",
      "title": "Fiber X",
      "subtitle": "TVC Poster",
      "category": "TVC Poster",
      "client": "Fiber X",
      "year": "2026",
      "location": "Baghdad, Iraq",
      "lead": "TVC poster for Fiber X, presented across five locations.",
      "cards": 1,
      "images": [
        "assets/media/fiber-x-tvc/001.webp|1.500",
        "9bc98cf0-e39a-4caa-86dc-3d9cfd62657d|12660c3599478cfcf4ded2b9085c044f|38ecc1b1b2456d4b8bbf6c117c90c524|d9ee40d760bdf79af2a1ae4e78d9b58f|1.5",
        "7069df58-162e-4ed8-83ea-5c0694e55d46|a2d41d2e9107241dfe1cb91261b67dd8|4a652e8340296d6f22e46424623a11bf|d037216234b6f5347b6b2731ef9c3867|1.5",
        "535f3502-ce46-4068-b4b0-679c4f22f71a|d7cb6bbb1cec4babaca301ee6605436f|dde2b162f080f3bf69b250505bcfdfd1|1f407ccaf67992ac7225114936ef9ab7|1.5",
        "062a978b-2950-4f6e-90b8-3c943971d652|9d957e57081e94404ec689e36be71675|e7bc70e570d9663712fc8eb5c41c6bb0|9cb29865a65919a8abe0df305db6205b|1.5",
        "c97bdccf-1d49-4337-b913-ad89a9f993d5|763490c5945d97d642b3c057c5e03d05|568bd38a968738ed659873dae5f5be64|3c0defadeaeaeb6f026ac4be29fb4311|1.5",
        "e8929df1-0041-4766-af0a-32d1fa35b12d|088eccc450557e3663633b0e16f596ef|411436773bf882fda8ccc53157b643cf|5370757355395be13151f48ef17b1a82|1.5",
        "82ce878f-7de4-46ba-9369-83f5da0696ae|23ca80d2c851451c35e226faa38b9d16|666ca436156cd1a6f2e4b6cfd4837ca8|6e0e1b2ea3d466414955c91aa960afbd|1.5",
        "19604b67-c185-4162-9ba0-8bef21394ba0|83b4c086e5e06bf80abba0e34530a450|c261cc25db8274974df4d4b068b83b15|94933134affd581db1ea5043bca21ccf|1.5",
        "5f47224e-1022-439d-9689-0f5e93946970|bd65f88a8391b730200de443105f8a90|dd7da39850655e514b5600c20a7d5146|eded6a0196091870da7505ac4fd71f6d|1.5",
        "10cb5a90-ad6d-4c0c-b18f-f73022aed0c9|ecc67ccf08d0c99af7facd7660566dfb|b74daae88842211b4b4d29ab795f25bc|6d0df7ff3cae50d2c91e1cd28ef69928|1.5",
        "6caa4369-be5c-4722-bb00-20a2cee38de9|1c7bb7a96cd9b42c337e9402f7dab93b|18ed5243aa354455d31880e5984aa201|1541d91333ee6b7f3cae1012a80245b0|1.5",
        "343ed78f-9ba6-4799-9658-f5b87845fd76|23d021d233ad2e38710fb9dd72d5fa84|6b44b64b3b808c43a65e96c16a6a5100|b7488186c6ed7a6907c82aaa179bd783|1.5",
        "b046bc4a-11e4-4c63-b0d8-852fe07763e6|1477468d54cf63ddaac94c5e7f2ea05a|f25460a81a051063396d460bdb698a0f|4e6a6bff7554b7edad2585120523b15a|1.5",
        "49edb05b-23b2-4f10-8856-1936fc12f441|bcdd561c3693071398dc15d1449d5ab8|1b72da1c59af2ea0f57e2a0dff8f87fe|5f312669405e68180e86805a3cb1c2b6|1.5"
      ]
    },
    {
      "slug": "zain-iraq",
      "title": "Zain Iraq",
      "subtitle": "Vibrant Commercial Stills",
      "category": "Campaign",
      "client": "Zain Iraq",
      "lead": "Vibrant Commercial Stills for Zain Iraq, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/zain-iraq/013.webp|0.667",
        "assets/media/zain-iraq/015.webp|0.800",
        "assets/media/zain-iraq/016.webp|0.667",
        "assets/media/zain-iraq/017.webp|0.667",
        "assets/media/zain-iraq/018.webp|0.667",
        "assets/media/zain-iraq/021.webp|0.800",
        "assets/media/zain-iraq/022.webp|0.667",
        "assets/media/zain-iraq/023.webp|0.800"
      ]
    },
    {
      "slug": "zain-cash",
      "title": "Zain Cash",
      "subtitle": "Advertising Campaign KVs",
      "category": "Campaign",
      "client": "Zain Cash",
      "role": "Photographer",
      "year": "2026",
      "location": "Baghdad, Iraq",
      "lead": "A photographic documentation and Key Visuals (KVs) for the Zain Cash advertising campaign, utilizing cinematic realism to capture authentic emotions and dramatic lighting.",
      "body": [
        "A photographic documentation of the Zain Cash advertising campaign. My primary goal in this project was to capture the essence of the ad and freeze those moments into high-quality Key Visuals. I focused heavily on highlighting the spontaneous and realistic emotions of the characters to serve as the main visual storefront of the promotional campaign.",
        "The biggest challenge for me was creating a perfect visual match with the video version of the ad. It required me to meticulously engineer the lighting and select angles to maintain my signature “Cinematic Realism” style. It was essential for me to make the viewer feel the exact same dramatic mood just by looking at these still shots.",
        "In this project, I made sure to emphasize the deep details in facial expressions and the actors’ movements within the commercial set. I unified the color grading and high contrast to serve the visual identity of Zain Cash, while preserving an authentic, heavy, and realistic Iraqi vibe that reflects the warmth and vitality of the scene."
      ],
      "cards": 1,
      "images": [
        "6800dedb-96ee-4a15-ab16-f1cffae4b06a|39be4a1991aa51f4672a2c14b388e2c4|f7482dc93e7fbb99ab378dc29bfb9018|e886ed11d51399cb272cdcf6d3b794b5|1.5",
        "7f845339-4a48-492d-86bf-d9d20f0b4901|6abb249e47311a4d4ab61285942aca11|e246fb3e632d3734339e14f6b573c2f5|151274a24f3910364ab32c9d634bc48c|1.5",
        "1fabcb5c-8d7b-4680-9170-00ab73844e6c|450b1c766076b2b2bac698870cb231d7|66ccc3f3698c971e5081f7e68efac9a4|b06a47d413329110ed58ebad8d032d2f|1.5",
        "66b05d4c-72ec-47f8-887b-6105b596480a|6247a08b38b878130ef1bcaa91712d7e|887dda62c2faab537bc10afc5bf8a13b|d535169f7ef3f49a5598ebc848c0aeb1|1.5",
        "8dc1e55b-9cc9-4efb-92dd-05f8b4179c14|b2c3ef899d26d2745a0da2ebf4eb2eae|23978e449f7b93baf51612dae6b007d9|63ea1d6173e17775edebbd3f3f26ccd8|1.5",
        "d28b1167-f9dd-42db-af89-b4dc2106afbb|463e8220e50ee4a5ebd648f09d1f400c|27fd806546a6f8c76c2a5d6b4eff311a|d93d14d7279ea30c493871ecb3de9381|1.5",
        "c7a3e283-eef4-4b73-86e0-eb970972b347|54a7377dc2433f6335792888146a6d42|c74025b5406a62c804b02cf5e4a678a6|8552e3a6bb642fa6d51366bc2a09ba23|1.5",
        "99eed373-5420-49cb-9519-53b24d88897e|c264346c63306f6619a1059278234f36|6abdfa44f1cbec63664089951219df81|c38b742b650317b6628529469270e2ec|1.5",
        "39a09b56-9308-4516-a7be-2b30b613fa98|bae43f9e55e1dfece8333ff945e4b9d5|befa5e74ae31c78aaa7e201d6229169a|89d4c19515fb1fb07a34ff2773f47ad2|1.5",
        "ca013aa4-de76-4e19-8bb6-913afe65335f|2ebd2cdd38b018218ca1af2b69323913|e0eebadabccc268c5fc96a6d17e3fe85|6a89ea1b4be6cb5e22f7f532d9d89608|1.5",
        "590a7e4d-2a02-4c64-b9ac-4dc2081de35b|de5f7c930f65e5ea78b9d82aa07a7870|70018113b181d64e92805f5b228196a3|443ea5521de110d780828e94183c09ed|1.5",
        "4542fddd-8698-42a2-8d1c-3e230064d373|e3314ab5448fea663db9144edfe51d0e|c31636869b38256f6b3b86b4c0e4ec75|4a6ddf620c6194f99791f99307580825|1.5"
      ]
    },
    {
      "slug": "fiber-x-stills",
      "title": "Fiber X",
      "subtitle": "Still Photography",
      "category": "Stills",
      "client": "Fiber X",
      "role": "Still Photographer",
      "year": "2026",
      "location": "Baghdad, Iraq",
      "lead": "Still photography documentation for the Fiber X commercial campaign. Captured on set by Khezez.",
      "body": [
        "On-set photographic documentation for the Fiber X commercial. In this project, I focused on freezing pivotal moments that reflect the narrative and tension using a “Cinematic Realism” style, translating the spirit of the commercial into still photographs that carry a visual weight worthy of the advertising identity.",
        "The technical challenge here was to match the low-key cinematic lighting used on set. I utilized the stark contrast between warm practical lights and heavy shadows to enhance the bold dramatic style, allowing the camera to capture the most subtle expressions and raw body language of the actors.",
        "I made sure to capture the true atmosphere of the set and freeze the spontaneous dramatic moments of the actors in action, naturally. The goal was to document the raw power of the performance and the overall heavy mood of the scene, while maintaining a consistent visual language that feels like a natural extension of the commercial’s camera movement.",
        "Through engineering visual composition and directing attention toward facial expressions and the commercial set details, we created images carrying a standalone narrative. Each frame was constructed to be strong as a still piece of art, independent of the video yet conveying the exact same dramatic state."
      ],
      "cards": 1,
      "images": [
        "assets/media/fiber-x-stills/001.webp|1.841",
        "c3f1dcd4-3545-4b2b-b4ba-a15c603f4764|2c378babee85acd1e21901880d512701|e28ccf1f3632275293c0cc9070eea02c|c8bafb938b79636d86e141ca95e51f5f|1.775",
        "560e59e1-4711-4a35-ad4c-51d8c67725f9|95aceff9eb35a291f0df3bb1075470c4|e226905aa457c072a91a4d5ace2a0bc0|9835b416975c37139841b6ba2241afea|1.775",
        "16a852d2-7833-4586-9639-42243a98a713|fc4a8d9b0ca1aa9dc84041a1ca38481e|9632c097431f31455f3844b6629fb29e|6cd8e431e07af3fb8141b35db6784660|1.775",
        "68586475-7cdd-4bdf-8382-b27bbd57c125|32d1ad6bde608cdb32f10933f1f8dc4b|c178d2cf8c2bf7eb07b513101b308318|b5ea3f7049e2be4291a35e3987d5b208|1.775",
        "cf2acd50-cd89-4f20-8103-a0caeb9ea69f|ac20093ed610f1f794d77a51d294adae|8171f205a25b765b727a5381008ef028|f41634e7dd4cd133373863c69bd67a55|1.775",
        "6ca5a196-3eb2-4c9a-9876-98989d232f4c|1ae14e8d11493f15519d02f8751cfefd|85eceec4ae93b269d5e724d08a019f77|1df11590a3cf44988669ddf10164ec62|1.775",
        "0c101c46-d262-4dba-aebf-774650351a94|b0c3fcefe826c4ebaa78b41fcace2c38|2865d239d8a2b4ac19ad16b54b59da5d|4057f67ca94a208a4eb926e852620e06|1.775",
        "68936109-e415-4c2a-8d8b-6d912809f53d|3455179597cb6b43e5aeba316c27abac|be33d1a84d45254b050063d543da95e9|d62af2e72cf18a6f59e97060effc0162|1.775",
        "0032de04-36c6-47a9-9e25-a6299c52432e|dee8fa2da7563710b7f04bd80e9b69fb|0f1faeb826f555fdae559437f0d4ca04|f99c2cdd01f94dc0aa210d30e25fe05a|1.775",
        "95639265-0931-4ba4-844f-36aaf17c552a|da8f505861f28170e8fba1558e79976a|2ce63a04fae3a40b067d73b17982104a|2ffa4b55116676b880aee1f7ade8c894|1.775",
        "6dd82fe8-e4da-4c87-acc9-940f302f1023|c06a1bb8787d5289fd4c50c157b6a78a|242fa538b61a7d75fa473fe3222d6470|7ce481b2629750cdb6e8ad1db4e42645|1.775",
        "69b00f90-b5cc-4982-965b-fbdb5c522d33|43dafe57675ef6db0466ff8656efac7a|af8d169b426df6d4d30080c562d97952|5732752d41cfcbd524c935f48581a1f4|1.775",
        "378af8eb-c8bb-4f55-80c2-8dc81d081db1|47ec5bad7942b8c26adf3993d2a8abbd|a829a37d89e28cbaa4d9bde59b267ea9|ae815f0b307ae0b268fd11c07ba3d377|1.775",
        "22a626ba-6285-4f1e-9294-a4861ac3cd6d|aab2a6d87710a9aa5286d7617e824478|cd33b105a2f51472be1c5805c836ea6c|4899409f49e981f22f5cf319dc33fa39|1.775",
        "4853abc9-46af-4216-9f29-3599412566d6|112783f21efcacca9d1a78522ba41673|4d1a60a8576ddb58091c1fdf98c83f9d|aaee763797be0bd7658e58705baf0155|1.775",
        "3cec26ad-faac-406f-ba6a-94bea1f847ee|950de572ac7382e963878d10f93b165c|9f4ef5e9c83d1cbbf48324b7096c5b17|8f65cb10d5a6f1f90f6fab0c0878c20e|1.775"
      ]
    },
    {
      "slug": "tecno-neon",
      "title": "Tecno Mobile",
      "subtitle": "Futuristic Neon Campaign",
      "category": "Smartphone",
      "client": "Tecno Mobile",
      "lead": "Futuristic Neon Campaign for Tecno Mobile, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/tecno-neon/001.webp|1.600"
      ]
    },
    {
      "slug": "poco",
      "title": "POCO Smartphone",
      "subtitle": "Neon Commercial Stills",
      "category": "Smartphone",
      "client": "POCO Smartphone",
      "lead": "Neon Commercial Stills for POCO Smartphone, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/poco/001.webp|0.800",
        "assets/media/poco/002.webp|0.750",
        "assets/media/poco/003.webp|0.750",
        "assets/media/poco/004.webp|0.750",
        "assets/media/poco/005.webp|0.750",
        "assets/media/poco/006.webp|0.562"
      ]
    },
    {
      "slug": "tecno-pova",
      "title": "Tecno Mobile POVA",
      "subtitle": "Modern Commercial Stills",
      "category": "Smartphone",
      "client": "Tecno Mobile POVA",
      "lead": "Modern Commercial Stills for Tecno Mobile POVA, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/tecno-pova/003.webp|0.800",
        "assets/media/tecno-pova/004.webp|0.800",
        "assets/media/tecno-pova/005.webp|0.800",
        "assets/media/tecno-pova/006.webp|0.800",
        "assets/media/tecno-pova/007.webp|0.800",
        "assets/media/tecno-pova/008.webp|0.800"
      ]
    },
    {
      "slug": "honor-showcase",
      "title": "Honor Smartphone",
      "subtitle": "Showcase Photoshoot",
      "category": "Smartphone",
      "client": "Honor Smartphone",
      "lead": "Showcase Photoshoot for Honor Smartphone, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/honor-showcase/001.webp|1.000",
        "assets/media/honor-showcase/002.webp|0.667",
        "assets/media/honor-showcase/003.webp|0.753",
        "assets/media/honor-showcase/004.webp|0.667",
        "assets/media/honor-showcase/005.webp|1.000",
        "assets/media/honor-showcase/006.webp|0.667"
      ]
    },
    {
      "slug": "honor-mutanabbi",
      "title": "Honor Smartphone",
      "subtitle": "Mutanabbi Showcase",
      "category": "Smartphone",
      "client": "Honor Smartphone",
      "lead": "Mutanabbi Showcase for Honor Smartphone, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/honor-mutanabbi/001.webp|0.667",
        "assets/media/honor-mutanabbi/002.webp|0.667",
        "assets/media/honor-mutanabbi/004.webp|0.667",
        "assets/media/honor-mutanabbi/005.webp|0.667"
      ]
    },
    {
      "slug": "realme-11",
      "title": "Realme 11",
      "subtitle": "Dramatic Neon Portrait",
      "category": "Smartphone",
      "client": "Realme 11",
      "lead": "Dramatic Neon Portrait for Realme 11, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/realme-11/001.webp|0.801"
      ]
    },
    {
      "slug": "realme-neon",
      "title": "Realme Smartphone",
      "subtitle": "Neon Commercial Stills",
      "category": "Smartphone",
      "client": "Realme Smartphone",
      "lead": "Neon Commercial Stills for Realme Smartphone, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/realme-neon/004.webp|0.667",
        "assets/media/realme-neon/005.webp|0.667",
        "assets/media/realme-neon/006.webp|0.667",
        "assets/media/realme-neon/007.webp|0.667",
        "assets/media/realme-neon/008.webp|0.818",
        "assets/media/realme-neon/009.webp|0.799",
        "assets/media/realme-neon/010.webp|0.667",
        "assets/media/realme-neon/011.webp|0.822"
      ]
    },
    {
      "slug": "casper",
      "title": "Casper Restaurant",
      "subtitle": "Cinematic F&B Stills",
      "category": "F&B",
      "client": "Casper Restaurant",
      "lead": "Cinematic F&B Stills for Casper Restaurant, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/casper/001.webp|0.806",
        "assets/media/casper/004.webp|0.667",
        "assets/media/casper/005.webp|0.800",
        "assets/media/casper/006.webp|0.800",
        "assets/media/casper/007.webp|0.806",
        "assets/media/casper/008.webp|0.806",
        "assets/media/casper/009.webp|0.806",
        "assets/media/casper/010.webp|0.806",
        "assets/media/casper/011.webp|0.806"
      ]
    },
    {
      "slug": "cafe-21",
      "title": "Cafe 21",
      "subtitle": "The Complete F&B Visual Identity",
      "category": "F&B",
      "client": "Cafe 21",
      "lead": "The Complete F&B Visual Identity for Cafe 21, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/cafe-21/001.webp|0.714",
        "assets/media/cafe-21/003.webp|1.294",
        "assets/media/cafe-21/005.webp|1.294",
        "assets/media/cafe-21/008.webp|1.294",
        "assets/media/cafe-21/010.webp|1.294",
        "assets/media/cafe-21/012.webp|1.294",
        "assets/media/cafe-21/014.webp|1.294",
        "assets/media/cafe-21/016.webp|1.294",
        "assets/media/cafe-21/019.webp|0.667"
      ]
    },
    {
      "slug": "mcha",
      "title": "MCHA Restaurant",
      "subtitle": "Cinematic Neon Menu",
      "category": "F&B",
      "client": "MCHA Restaurant",
      "lead": "Cinematic Neon Menu for MCHA Restaurant, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/mcha/001.webp|1.461",
        "assets/media/mcha/005.webp|0.667",
        "assets/media/mcha/008.webp|0.667",
        "assets/media/mcha/011.webp|0.667",
        "assets/media/mcha/014.webp|0.667",
        "assets/media/mcha/018.webp|0.667",
        "assets/media/mcha/021.webp|0.667",
        "assets/media/mcha/024.webp|0.667"
      ]
    },
    {
      "slug": "hamasa",
      "title": "Hamasa",
      "subtitle": "Integrated Cinematic Campaign",
      "category": "F&B",
      "client": "Hamasa",
      "lead": "Integrated Cinematic Campaign for Hamasa, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/hamasa/002.webp|0.671",
        "assets/media/hamasa/003.webp|0.671",
        "assets/media/hamasa/004.webp|0.671",
        "assets/media/hamasa/005.webp|0.671",
        "assets/media/hamasa/006.webp|0.671",
        "assets/media/hamasa/007.webp|0.671",
        "assets/media/hamasa/008.webp|0.671",
        "assets/media/hamasa/009.webp|0.671",
        "assets/media/hamasa/010.webp|0.671"
      ]
    },
    {
      "slug": "mokador",
      "title": "Mokador",
      "subtitle": "A Year of Cinematic Realism",
      "category": "F&B",
      "client": "Mokador",
      "lead": "A Year of Cinematic Realism for Mokador, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/mokador/001.webp|1.778",
        "assets/media/mokador/003.webp|0.714",
        "assets/media/mokador/005.webp|0.714",
        "assets/media/mokador/007.webp|0.714",
        "assets/media/mokador/010.webp|0.714",
        "assets/media/mokador/012.webp|0.714",
        "assets/media/mokador/014.webp|1.778",
        "assets/media/mokador/016.webp|0.714"
      ]
    },
    {
      "slug": "si-restaurant",
      "title": "Si Restaurant",
      "subtitle": "Cinematic Dining & Lifestyle",
      "category": "F&B",
      "client": "Si Restaurant",
      "lead": "Cinematic Dining & Lifestyle for Si Restaurant, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/si-restaurant/001.webp|1.333",
        "assets/media/si-restaurant/006.webp|0.750",
        "assets/media/si-restaurant/008.webp|0.750",
        "assets/media/si-restaurant/011.webp|0.750",
        "assets/media/si-restaurant/013.webp|0.750",
        "assets/media/si-restaurant/016.webp|1.333",
        "assets/media/si-restaurant/019.webp|1.333",
        "assets/media/si-restaurant/021.webp|1.333"
      ]
    },
    {
      "slug": "munkhal",
      "title": "Munkhal Bakery",
      "subtitle": "Traditional Iraqi Aesthetics",
      "category": "F&B",
      "client": "Munkhal Bakery",
      "lead": "Traditional Iraqi Aesthetics for Munkhal Bakery, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/munkhal/001.webp|0.667",
        "assets/media/munkhal/005.webp|0.750",
        "assets/media/munkhal/008.webp|0.750",
        "assets/media/munkhal/011.webp|0.750",
        "assets/media/munkhal/014.webp|0.750",
        "assets/media/munkhal/016.webp|0.750",
        "assets/media/munkhal/019.webp|0.750",
        "assets/media/munkhal/022.webp|0.750"
      ]
    },
    {
      "slug": "breast-cancer",
      "title": "Breast Cancer Awareness",
      "subtitle": "Cinematic Campaign",
      "category": "Campaign",
      "client": "Breast Cancer Awareness",
      "lead": "Cinematic Campaign for Breast Cancer Awareness, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/breast-cancer/004.webp|0.714",
        "assets/media/breast-cancer/005.webp|0.714",
        "assets/media/breast-cancer/006.webp|0.714",
        "assets/media/breast-cancer/007.webp|0.714",
        "assets/media/breast-cancer/008.webp|0.714"
      ]
    },
    {
      "slug": "next-level",
      "title": "Next Level Energy Drink",
      "subtitle": "Cinematic Night Portrait",
      "category": "Campaign",
      "client": "Next Level Energy Drink",
      "lead": "Cinematic Night Portrait for Next Level Energy Drink, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/next-level/001.webp|0.797",
        "assets/media/next-level/004.webp|0.797",
        "assets/media/next-level/005.webp|0.797",
        "assets/media/next-level/006.webp|0.797",
        "assets/media/next-level/007.webp|0.797",
        "assets/media/next-level/008.webp|0.797"
      ]
    },
    {
      "slug": "eleganza-mia",
      "title": "Eleganza Mia",
      "subtitle": "Autumn Trends Campaign",
      "category": "Fashion",
      "client": "Eleganza Mia",
      "lead": "Autumn Trends Campaign for Eleganza Mia, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/eleganza-mia/002.webp|0.865",
        "assets/media/eleganza-mia/005.webp|0.802",
        "assets/media/eleganza-mia/008.webp|0.802",
        "assets/media/eleganza-mia/010.webp|0.802",
        "assets/media/eleganza-mia/013.webp|0.802",
        "assets/media/eleganza-mia/015.webp|0.802",
        "assets/media/eleganza-mia/017.webp|0.865",
        "assets/media/eleganza-mia/020.webp|0.802",
        "assets/media/eleganza-mia/022.webp|0.802"
      ]
    },
    {
      "slug": "hussein-hafiz-neon",
      "title": "Hussein Hafiz",
      "subtitle": "Cinematic Neon Portrait",
      "category": "Portrait",
      "client": "Hussein Hafiz",
      "lead": "Cinematic Neon Portrait for Hussein Hafiz, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/hussein-hafiz-neon/001.webp|1.778",
        "assets/media/hussein-hafiz-neon/004.webp|0.667",
        "assets/media/hussein-hafiz-neon/005.webp|0.667",
        "assets/media/hussein-hafiz-neon/006.webp|0.667",
        "assets/media/hussein-hafiz-neon/007.webp|0.714",
        "assets/media/hussein-hafiz-neon/008.webp|1.778",
        "assets/media/hussein-hafiz-neon/009.webp|0.667",
        "assets/media/hussein-hafiz-neon/010.webp|0.667",
        "assets/media/hussein-hafiz-neon/011.webp|0.667"
      ]
    },
    {
      "slug": "vibora-lifestyle",
      "title": "Vibora Padel Club",
      "subtitle": "Sports Lifestyle Campaign",
      "category": "Sport",
      "client": "Vibora Padel Club",
      "lead": "Sports Lifestyle Campaign for Vibora Padel Club, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/vibora-lifestyle/003.webp|0.667",
        "assets/media/vibora-lifestyle/004.webp|0.667",
        "assets/media/vibora-lifestyle/005.webp|0.667",
        "assets/media/vibora-lifestyle/006.webp|0.667",
        "assets/media/vibora-lifestyle/007.webp|1.500",
        "assets/media/vibora-lifestyle/008.webp|1.500",
        "assets/media/vibora-lifestyle/009.webp|1.500",
        "assets/media/vibora-lifestyle/010.webp|1.500"
      ]
    },
    {
      "slug": "hussein-hafiz-street",
      "title": "Hussein Hafiz",
      "subtitle": "Cinematic Street Portrait",
      "category": "Portrait",
      "client": "Hussein Hafiz",
      "lead": "Cinematic Street Portrait for Hussein Hafiz, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/hussein-hafiz-street/001.webp|1.778",
        "assets/media/hussein-hafiz-street/004.webp|0.667",
        "assets/media/hussein-hafiz-street/005.webp|1.500",
        "assets/media/hussein-hafiz-street/006.webp|1.500",
        "assets/media/hussein-hafiz-street/007.webp|1.500",
        "assets/media/hussein-hafiz-street/008.webp|0.562",
        "assets/media/hussein-hafiz-street/009.webp|0.667",
        "assets/media/hussein-hafiz-street/010.webp|0.778",
        "assets/media/hussein-hafiz-street/011.webp|0.740"
      ]
    },
    {
      "slug": "vibora-action",
      "title": "Vibora Padel",
      "subtitle": "The Action & Empowerment Campaign",
      "category": "Sport",
      "client": "Vibora Padel",
      "lead": "The Action & Empowerment Campaign for Vibora Padel, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/vibora-action/003.webp|1.500",
        "assets/media/vibora-action/004.webp|1.500",
        "assets/media/vibora-action/005.webp|1.500",
        "assets/media/vibora-action/007.webp|1.500",
        "assets/media/vibora-action/008.webp|0.667",
        "assets/media/vibora-action/009.webp|0.667",
        "assets/media/vibora-action/010.webp|1.500",
        "assets/media/vibora-action/011.webp|1.500"
      ]
    },
    {
      "slug": "rafal",
      "title": "Rafal",
      "subtitle": "Shadows & Silhouettes Maternity Session",
      "category": "Portrait",
      "client": "Rafal",
      "lead": "Shadows & Silhouettes Maternity Session for Rafal, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/rafal/002.webp|0.776",
        "assets/media/rafal/003.webp|0.714",
        "assets/media/rafal/004.webp|0.667",
        "assets/media/rafal/005.webp|1.500",
        "assets/media/rafal/006.webp|0.667",
        "assets/media/rafal/007.webp|1.500",
        "assets/media/rafal/008.webp|1.500",
        "assets/media/rafal/009.webp|1.500"
      ]
    },
    {
      "slug": "si-nightlife",
      "title": "Si Restaurant",
      "subtitle": "Dynamic Nightlife Vibe",
      "category": "F&B",
      "client": "Si Restaurant",
      "lead": "Dynamic Nightlife Vibe for Si Restaurant, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/si-nightlife/002.webp|0.667",
        "assets/media/si-nightlife/003.webp|0.667",
        "assets/media/si-nightlife/004.webp|0.667",
        "assets/media/si-nightlife/005.webp|0.667",
        "assets/media/si-nightlife/006.webp|0.667",
        "assets/media/si-nightlife/007.webp|0.667",
        "assets/media/si-nightlife/008.webp|0.667",
        "assets/media/si-nightlife/009.webp|0.667"
      ]
    },
    {
      "slug": "neon-nights",
      "title": "Neon Nights",
      "subtitle": "Cinematic Urban Portrait",
      "category": "Portrait",
      "client": "Neon Nights",
      "lead": "Cinematic Urban Portrait for Neon Nights, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/neon-nights/003.webp|0.667",
        "assets/media/neon-nights/004.webp|1.500",
        "assets/media/neon-nights/005.webp|0.800",
        "assets/media/neon-nights/006.webp|1.500",
        "assets/media/neon-nights/007.webp|0.667",
        "assets/media/neon-nights/008.webp|0.667",
        "assets/media/neon-nights/009.webp|0.667",
        "assets/media/neon-nights/010.webp|0.667"
      ]
    },
    {
      "slug": "white-tiger",
      "title": "White Tiger Energy",
      "subtitle": "Cinematic Commercial Stills",
      "category": "Campaign",
      "client": "White Tiger Energy",
      "lead": "Cinematic Commercial Stills for White Tiger Energy, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/white-tiger/001.webp|0.667",
        "assets/media/white-tiger/002.webp|0.667",
        "assets/media/white-tiger/004.webp|0.667",
        "assets/media/white-tiger/005.webp|0.826",
        "assets/media/white-tiger/007.webp|0.667",
        "assets/media/white-tiger/008.webp|0.667",
        "assets/media/white-tiger/009.webp|0.667",
        "assets/media/white-tiger/011.webp|0.781"
      ]
    },
    {
      "slug": "pizza-nina",
      "title": "Pizza Nina",
      "subtitle": "Authentic Pasta Photography",
      "category": "F&B",
      "client": "Pizza Nina",
      "lead": "Authentic Pasta Photography for Pizza Nina, photographed by Khezez.",
      "cards": 1,
      "images": [
        "assets/media/pizza-nina/004.webp|1.500",
        "assets/media/pizza-nina/005.webp|0.667",
        "assets/media/pizza-nina/006.webp|0.667",
        "assets/media/pizza-nina/007.webp|1.500",
        "assets/media/pizza-nina/008.webp|0.667",
        "assets/media/pizza-nina/009.webp|0.714",
        "assets/media/pizza-nina/010.webp|1.500",
        "assets/media/pizza-nina/011.webp|0.667"
      ]
    }
  ]
};
