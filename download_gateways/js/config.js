var INLINE_GATEWAYS = [
    "https://ipfs.io/ipfs/:hash",
    "https://dweb.link/ipfs/:hash",
    "https://gateway.ipfs.io/ipfs/:hash",
    "https://ipfs.infura.io/ipfs/:hash",
    "https://ninetailed.ninja/ipfs/:hash",
    "https://10.via0.com/ipfs/:hash",
    "https://ipfs.eternum.io/ipfs/:hash",
    "https://hardbin.com/ipfs/:hash",
    "https://cloudflare-ipfs.com/ipfs/:hash",
    "https://cf-ipfs.com/ipfs/:hash",
    "https://gateway.originprotocol.com/ipfs/:hash",
    "https://gateway.pinata.cloud/ipfs/:hash",
    "https://ipfs.sloppyta.co/ipfs/:hash",
    "https://ipfs.greyh.at/ipfs/:hash",
    "https://gateway.serph.network/ipfs/:hash",
    "https://jorropo.ovh/ipfs/:hash",
    "https://jorropo.net/ipfs/:hash",
    "https://gateway.temporal.cloud/ipfs/:hash",
    "https://permaweb.io/ipfs/:hash",
    "https://ipfs.stibarc.com/ipfs/:hash",
    "https://ipfs.best-practice.se/ipfs/:hash",
    "https://2read.net/ipfs/:hash",
    "https://ipfs.2read.net/ipfs/:hash",
    "https://storjipfs-gateway.com/ipfs/:hash",
    "https://ipfs.runfission.com/ipfs/:hash",
    "https://trusti.id/ipfs/:hash",
    "https://apac.trusti.id/ipfs/:hash",
    "https://ipfs.overpi.com/ipfs/:hash",
    "https://ipfs.lc/ipfs/:hash",
    "https://ipfs.leiyun.org/ipfs/:hash",
    "https://ipfs.ink/ipfs/:hash",
    "https://ipfs.jes.xxx/ipfs/:hash",
    "https://ipfs.oceanprotocol.com/ipfs/:hash",
    "https://gateway.ravenland.org/ipfs/:hash",
    "https://ipfs.smartsignature.io/ipfs/:hash",
    "https://ipfs.funnychain.co/ipfs/:hash",
    "https://ipfs.telos.miami/ipfs/:hash",
    "https://robotizing.net/ipfs/:hash",
    "https://ipfs.mttk.net/ipfs/:hash",
    "https://ipfs.fleek.co/ipfs/:hash",
    "https://ipfs.jbb.one/ipfs/:hash",
    "https://ipfs.yt/ipfs/:hash",
    "https://jacl.tech/ipfs/:hash",
    "https://ipfs.k1ic.com/ipfs/:hash",
    "https://ipfs.drink.cafe/ipfs/:hash",
    "https://ipfs.azurewebsites.net/ipfs/:hash",
    "https://gw.ipfspin.com/ipfs/:hash",
    "https://ipfs.robotics.bmstu.ru/ipfs/:hash"
];

var GATEWAY_SOURCES = {
    "Built-in Gateways": "[built-in list]",
    "Official Gateway Checker": "https://raw.githubusercontent.com/ipfs/public-gateway-checker/master/gateways.json",
    "Custom": ""
};

var PROBE_FILES = [
    {
        'name' : '256KB file',
        'file_name' : 'jttw-00.txt',
        'size' : 256720
    },
    {
        'name' : '512KB file',
        'file_name' : 'jttw-01.txt',
        'size' : 511749
    },
    {
        'name' : '1MB file',
        'file_name' : 'jttw-02.txt',
        'size' : 1050518
    },
    {
        'name' : '2MB file',
        'file_name' : 'jttw-03.txt',
        'size' : 2139907
    }];

var CID = "bafybeibpzglm4djqgyee6hsd2lv66sdnwbm5g5qv6aoos23lwsphoof4gq/website/"