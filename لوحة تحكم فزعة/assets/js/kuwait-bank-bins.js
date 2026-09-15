// قاعدة BIN للبنوك — أول تطابق حسب ترتيب القائمة.
// label = الاسم المختصر الإنجليزي الذي يُطبع على البطاقة.
(function (window) {
  window.KUWAIT_BANK_BINS = [
    // ── بنوك الإمارات ──
    { name: 'enbd',     label: 'Emirates NBD', bins: ['419725','508729','530891','531207','411139','409201'] },
    { name: 'mashreq',  label: 'Mashreq',  bins: ['417856','455797','491266','516510','547352'] },
    { name: 'fab',      label: 'FAB',      bins: ['418317','420515','433060','533440','480274'] },
    { name: 'adib',     label: 'ADIB',     bins: ['410338','421196','454908','529741'] },
    { name: 'dib',      label: 'Dubai Islamic', bins: ['454060','463003','470650','537767'] },
    { name: 'rakbank',  label: 'RAK Bank', bins: ['420133','425687','495094'] },
    { name: 'hsbc',     label: 'HSBC UAE', bins: ['424264','424265','423114','561200'] },
    { name: 'citi',     label: 'Citi',     bins: ['542418','542456','552707'] },
    // ── بنوك خليجية ──
    { name: 'kfh',      label: 'KFH',      bins: ['485602','450605','450778','450779','450780','532672','532673'] },
    { name: 'nbk',      label: 'NBK',      bins: ['464452','589160','402518','402519','402520','543363','540801'] },
    { name: 'boubyan',  label: 'Boubyan',  bins: ['490898','415254','415255','450098'] },
    { name: 'gulf',     label: 'Gulf Bank',bins: ['517419','431187','428339','531481','540759'] },
    { name: 'alrajhi',  label: 'Al Rajhi', bins: ['419593','446660','483000','205871'] },
    { name: 'qnb',      label: 'QNB',      bins: ['413200','530071','531451'] },
    { name: 'bankmuscat', label: 'BankMuscat', bins: ['413303','419613','421584'] },
    { name: 'warba',    label: 'Warba',    bins: ['537015','537016','525528'] },
    { name: 'icbc',     label: 'ICBC',     bins: ['520471','548795'] }
  ];
})(window);
