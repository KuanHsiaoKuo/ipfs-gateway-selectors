document.documentElement.lang = navigator.language;
let BOOTUP_URL = window.location.href.substr(0, window.location.href.lastIndexOf('/'));
let TIMEOUT = 3000;
let PROBE_ID = 'QmVyHMgZygMV8zRgrdFpGQNB17YnbaB9Dz82AJoGBeudd1';


let translations = L[detect_language()];
let gateways = [];
let cid = CID;


$(document).ready(function () {
    rend_page();
    fetch_gateways(cid, test_all_lag);
    let queryParams = new URLSearchParams(window.location.search);

    let source_custom = localStorage.getItem('source_custom');
    if (!is_null(source_custom) && source_custom.length > 0) {
        GATEWAY_SOURCES['Custom'] = source_custom;
    }

    $('#gateway_source_selector').empty();
    for (let key in GATEWAY_SOURCES) {
        $('#gateway_source_selector').append('<option value="' + GATEWAY_SOURCES[key] + '">' + key + '</option>');
    }
    $('#gateway_source_selector').on('change', function () {
        let selected = $("#gateway_source_selector option:selected");
        $('#gateway_source').val(selected.val());
        localStorage.setItem('source_selected', selected.text());
        if (selected.text() == 'Custom') {
            $('#gateway_source').prop('readonly', false);
        } else {
            $('#gateway_source').prop('readonly', true);
        }
    });

    let source_selected = localStorage.getItem('source_selected');
    console.log(source_selected);
    if (is_null(source_selected)) {
        source_selected = 'Built-in Gateways';
    }
    $('#gateway_source_selector').val(GATEWAY_SOURCES[source_selected]).change();
    localStorage.setItem('source_selected', source_selected);

    $('#probe_file').empty();
    for (let i in PROBE_FILES) {
        $('#probe_file').append('<option value="' + i + '">' + PROBE_FILES[i].name + '</option>');
    }
    $('#probe_file').val(0);

    $('#timeout').attr("value", TIMEOUT);

    $('#btn_reload').click(function () {
        fetch_gateways(cid, test_all_lag);
    });
    // 延迟测速
    $('#btn_lag_test').click(function () {
        test_all_lag();
    });

    $('#btn_clear').click(function () {
        clear_history();
    });

    // if (gateways.length == 0) {
    //     fetch_gateways(test_all_lag);
    // }
});

function rend_page() {
    $('header').html($.templates("#tpl_header").render(translations));
    $('#row2').html($.templates("#tpl_row2").render(translations));
}

function fetch_gateways(cid, onfinish) {
    // add_history($('#cid').val());
    // let selected_source = $("#gateway_source_selector option:selected").text();
    selected_source = "Built-in Gateways"
    // 清空网关测试列表
    $("#gw_list").empty();
    $("#gw_list").append('<li class="list-group-item d-flex justify-content-between lh-condensed"><div>入口检测中...</div><span></span></li>');
    gateways = [];
    // 使用内置网关
    if (selected_source == 'Built-in Gateways') {
        build_in_gateways(cid, onfinish)
    } else {
        // let url = $('#gateway_source').val();
        // if (selected_source == 'Custom') {
        //     localStorage.setItem('source_custom', url);
        // }
        custom_gateways(url, cid, onfinish)

    }
}

function build_in_gateways(cid, onfinish) {
    $("#gw_list").empty();
    // 迭代生成网关测试列表
    for (i in INLINE_GATEWAYS) {
        let gw = {
            'url': INLINE_GATEWAYS[i],
            'domain': INLINE_GATEWAYS[i].replace('http://', '').replace('https://', '').split(/[/?#]/)[0],
            'lag': -1,
            'speed': -1
        };
        gateways.push(gw);
        // 生成测试展示元素
        // let li = '<li id="gw_' + i + '" class="list-group-item d-flex justify-content-between lh-condensed">' +
        //     '<div><a href="' + gw.url.replace(':hash', $('#cid').val()) + '">' + gw.domain + '</a></div><span><span></span> <span></span></span></li>';
        let li = '<li id="gw_' + i + '" class="list-group-item d-flex justify-content-between lh-condensed">' +
            '<div><a href="' + gw.url.replace(':hash', cid) + '">' + gw.domain + '</a></div><span><span></span> <span></span></span></li>';
        $("#gw_list").append(li);
    }
    onfinish();
}

function custom_gateways(url, cid) {
    $.ajax({
        url: url,
        method: 'GET',
        timeout: $('#timeout').val(),
        dataType: 'json'
    }).done(function (json) {
        $("#gw_list").empty();
        for (i in json) {
            let gw = {
                'url': json[i],
                'domain': json[i].replace('http://', '').replace('https://', '').split(/[/?#]/)[0],
                'lag': -1,
                'speed': -1
            };
            gateways.push(gw);
            let li = '<li id="gw_' + i + '" class="list-group-item d-flex justify-content-between lh-condensed">' +
                '<div><a href="' + gw.url.replace(':hash', $('#cid').val()) + '">' + gw.domain + '</a></div><span><span></span> <span></span></span></li>';
            $("#gw_list").append(li);
        }
        onfinish();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $("#gw_list li div").text('Failed: ' + jqXHR.statusText);
    });
}

function test_all_lag() {
    for (i in gateways) {
        test_lag(i);
    }
}

function test_lag(i) {
    $('#gw_' + i + ' span span:nth-child(2)').empty();
    gateways[i].lag = -1;

    let task = {
        url: gateways[i].url.replace(/:hash/, PROBE_ID + '/1-byte.txt'),
        method: 'GET',
        timeout: parseInt($('#timeout').val()),
        dataType: 'text',
        cache: false
    };
    task.success = function (data, textStatus, jqXHR, t) {
        let latency = (new Date()).getTime() - t;
        gateways[i].lag = latency;
        $('#gw_' + i + ' span span:nth-child(2)').text(latency + ' ms');
        if (latency < 500) {
            $('#gw_' + i + ' span span:nth-child(2)').attr('class', 'badge badge-success');
        } else if (latency < 1000) {
            $('#gw_' + i + ' span span:nth-child(2)').attr('class', 'badge badge-warning');
        } else {
            $('#gw_' + i + ' span span:nth-child(2)').attr('class', 'badge badge-danger');
        }
    };
    task.error = function (jqXHR, textStatus, errorThrown) {
        console.log(gateways[i].domain + ':' + jqXHR.statusText);
        $('#gw_' + i + ' span span:nth-child(2)').text(jqXHR.statusText).attr('class', 'badge badge-secondary');
    };

    addAjax(task);
}

function test_all_speed() {
    for (i in gateways) {
        if (gateways[i].lag > 0) {
            test_speed(i);
        }
    }
}

function test_speed(i) {
    let file_path = PROBE_ID + '/' + PROBE_FILES[$('#probe_file').val()].file_name;
    $('#gw_' + i + ' span span:nth-child(1)').empty();

    let task = {
        url: gateways[i].url.replace(/:hash/, file_path),
        method: 'GET',
        timeout: parseInt($('#timeout').val()) + 2000,
        dataType: 'text',
        cache: false
    };
    task.success = function (data, textStatus, jqXHR, t) {
        let duration = ((new Date()).getTime() - t) / 1000;
        let speed_kbps = (PROBE_FILES[$('#probe_file').val()].size / (duration * 1024)).toFixed(2);
        console.log(gateways[i] + ': ' + speed_kbps + ' ' + duration);
        $('#gw_' + i + ' span span:nth-child(1)').text(speed_kbps + ' KB/s');
        if (speed_kbps > 500) {
            $('#gw_' + i + ' span span:nth-child(1)').attr('class', 'badge badge-success');
        } else if (speed_kbps > 200) {
            $('#gw_' + i + ' span span:nth-child(1)').attr('class', 'badge badge-warning');
        } else {
            $('#gw_' + i + ' span span:nth-child(1)').attr('class', 'badge badge-danger');
        }
    };
    task.error = function (jqXHR, textStatus, errorThrown) {
        console.log(gateways[i].domain + ':' + jqXHR.statusText);
        $('#gw_' + i + ' span span:nth-child(1)').text(jqXHR.statusText).attr('class', 'badge badge-secondary');
    };
    addAjax(task);
}

function extract_cid(input) {
    if (is_null(input)) {
        return '';
    }
    // length=46 prefix="Qm", it's a CIDv0
    // length=52 prefix="12D"
    // length=[59,111] prefix="ba", all lowercase
    // length=53 prefix="16U"
    let matches = input.match(/Qm[A-Za-z0-9]{44}|ba[a-z0-9]{57,109}|12D[A-Za-z0-9]{49}|16U[A-Za-z0-9]{50}/);
    if (matches !== null && matches.length > 0) {
        return matches[0];
    }
    return '';
}

function add_history(cid) {
    let history_json = localStorage.getItem('cid_history');
    if (is_null(history_json)) {
        history_json = '[]';
    }
    let histories = JSON.parse(history_json);
    if (cid.length > 16) {
        let item = {'cid': cid, 'time': (new Date()).getTime()};
        histories.unshift(item);
        for (let i = 1; i < histories.length; i++) {
            if (histories[i].cid == cid) {
                histories.splice(i, 1);
                break;
            }
        }
        if (histories.length > 30) {
            histories = histories.slice(0, 30);
        }
        localStorage.setItem('cid_history', JSON.stringify(histories));
    }
    reload_history();
}

function reload_history() {
    $("#history_list").empty();
    let history_json = localStorage.getItem('cid_history');
    if (is_null(history_json)) {
        history_json = '[]';
    }
    let histories = JSON.parse(history_json);
    for (i in histories) {
        let link = BOOTUP_URL + '/?cid=' + histories[i].cid;
        let li = '<li class="list-group-item d-flex justify-content-between lh-condensed">' +
            '<div><a href="' + link + '">' + shorten(histories[i].cid, 16) + '</a></div><span>' + $.format.date(histories[i].time, 'yyyy-MM-dd HH:mm:ss') + '</span></li>';
        $("#history_list").append(li);
    }
}

function clear_history() {
    $("#history_list").empty();
    localStorage.setItem('cid_history', '[]');
}

function detect_language() {
    let lang = navigator.language || navigator.userLanguage;
    if (lang.split('-')[0].toLowerCase() == 'zh') {
        return 'zh-cn';
    } else {
        return 'en';
    }
}

function is_null(v) {
    return (v === undefined || v === null);
}

function shorten(v, len) {
    let tail = len - 8;
    if (tail < 4) tail = 4;
    return v.substr(0, 5) + '...' + v.substr(cid.length - tail, tail);
}

// AJAX Queue
let ajaxReqs = 0;
let ajaxQueue = [];
let ajaxActive = 0;
let ajaxMaxConc = 4;

function addAjax(obj) {
    ajaxReqs++;
    let oldSuccess = obj.success;
    let oldError = obj.error;
    let callback = function () {
        ajaxReqs--;
        if (ajaxActive === ajaxMaxConc && ajaxQueue.length > 0) {
            let o = ajaxQueue.shift();
            o.t = (new Date()).getTime();
            $.ajax(o);
        } else {
            ajaxActive--;
        }
    }
    obj.success = function (resp, textStatus, jqXHR) {
        if (oldSuccess) oldSuccess(resp, textStatus, jqXHR, this.t);
        callback();
    };
    obj.error = function (xhr, status, error) {
        if (oldError) oldError(xhr, status, error);
        callback();
    };
    if (ajaxActive === ajaxMaxConc) {
        ajaxQueue.push(obj);
    } else {
        ajaxActive++;
        obj.t = (new Date()).getTime();
        $.ajax(obj);
    }
}