define([
    "views/menus/search",
    "views/menus/message",
    "views/menus/profile",
    "views/menus/sidebar",
    "views/webix/icon",
    "views/webix/menutree"
], function (search, message, profile, menu) {

    //Top toolbar
    var mainToolbar = {
        view: "toolbar",

        css: 'load_page_border',
        elements: [
            {view: "label", label: "<img class='photo' src='assets/imgs/logo_gold.png' height='48'/>", width: 60},
            {template: '<span style="font-size: 22px; line-height:38px;">北京市公安局警犬技术工作管理与实战应用系统</span>', css: "header_title"},
            // {template: 'webix-master', css: "header_title"},

            {},
            // {view: "icon", icon: "search",  width: 45, popup: "searchPopup"},
            // {view: "icon", icon: "envelope-o", value: 3, width: 45, popup: "mailPopup"},
            {template: '<div style="line-height: 38px;font-size:14px"><a href="#!/app/adult.adultList" style="color: #FFF900;font-weight:bold">进入系统</a></div>', borderless: true, width: 100, hidden: (USER_INFO.userRole == 'FJ_JuZhang' || USER_INFO.userRole == 'JuZhang')},
            {view: "icon", icon: "comments-o", value: '0', width: 60, id:'todoTip', click: function(){showTodoList('1')}, hidden: (USER_INFO.userRole == 'FJ_JuZhang' || USER_INFO.userRole == 'JuZhang')},
            {
                height: 46, id: "person_template", css: "header_person", borderless: true, width: 192,
                data: {id: 3, name: USER_INFO.policeName},
                template: function (obj) {
                    var width = obj.name.length * 25 + 30;
                    if(width < 150){
                        width = 150;
                    }
                    $$('person_template').define('width', width);
                    var html = "<div align='right' style='height:100%;width:100%;' onclick='webix.$$(\"profilePopup\").show(this)'>";
                    html += "<img class='photo' src='assets/imgs/photos/" + obj.id + ".png' /><div style='float: left;width: " + (width - 90) + "px;text-align: right;margin-left: 9px;color:#fff;'>" + obj.name + "</div>";
                    html += "<span class='webix_icon fa-angle-down'></span></div>";
                    return html;
                }
            }
        ]
    };

    var body = {
        rows: [
            {
                height: 49,
                id: "title",
                css: "title",
                template: "<div class='header'>#title#</div>",
                data: {text: "", title: ""}
            },
            {
                $subview: true
                // view: "scrollview",
                // body: {cols: [{}]}
            }
        ]
    };

    var layout = {
        rows: [
            mainToolbar,
            {
                cols: [
                    menu,
                    {view: 'resizer', id: 'resizer'},
                    body
                ]
            }
        ]

    };

    window.onhashchange = function() {
        if(window.location.href.indexOf("dashboard") != -1){
            $$('title').hide();
            $$('left_menu').hide();
            $$('resizer').hide();
        }else{
            $$('title').show();
            $$('left_menu').show();
            $$('resizer').show();
        }
    };

    window.showTodoList = function (isShowTodoList){
        if(USER_INFO.userRole == 'FJ_JuZhang' || USER_INFO.userRole == 'JuZhang'){
            return ;
        }
        doIPost('todo/getMyTodo', {}, function (resp) {
            if(resp.success && resp.result.length > 0) {
                var arr = resp.result;

                var html = '<div style="font-size: 16px;color:#fff;line-height: 25px;">';
                html += '<div>您有如下待办事项需要处理，请及时处理：</div>';
                var label = {
                    worm: '<span style="color:#fff">驱虫提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬需要进行驱虫处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/wormImmue.worm" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    immue: '<span style="color:#fff">免疫提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬需要进行免疫处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/wormImmue.immue" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    dogApply: '<span style="color:#fff">警犬申请：</span>有<span style="color:#F9FF00">#val#</span>个警犬申请单，请及时审批;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.list" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    tickout: '<span style="color:#fff">淘汰审批：</span>有<span style="color:#F9FF00">#val#</span>头警犬申请淘汰，请及时审批;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.tickoutList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    die: '<span style="color:#fff">死亡审批：</span>有<span style="color:#F9FF00">#val#</span>头警犬死亡，请审批死亡报告;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.dieList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    train: '<span style="color:#fff">培训提醒：</span>您有<span style="color:#F9FF00">#val#</span>头警犬即将到达培训日期，请关注培训信息，及时报名参加;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/train.createTrain" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                };
                if(USER_INFO.userRole == 'SuperMan' || USER_INFO.userRole == 'JiuZhiDui' ){
                    label = {
                        worm: '<span style="color:#fff">驱虫提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬需要进行驱虫处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/wormImmue.worm" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        immue: '<span style="color:#fff">免疫提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬需要进行免疫处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/wormImmue.immue" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        dogApply: '<span style="color:#fff">警犬申请：</span>有<span style="color:#F9FF00">#val#</span>个警犬申请单，请及时审批;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.list" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        tickout: '<span style="color:#fff">淘汰审批：</span>有<span style="color:#F9FF00">#val#</span>头警犬申请淘汰，请及时审批;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.tickoutList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        die: '<span style="color:#fff">死亡审批：</span>您有<span style="color:#F9FF00">#val#</span>头警犬死亡，请审批死亡报告;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.dieList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        train: '<span style="color:#fff">培训提醒：</span>您有<span style="color:#F9FF00">#val#</span>头警犬即将到达培训日期，请关注培训信息，及时报名参加;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/train.createTrain" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    };
                }else if(USER_INFO.userRole == 'FJ_JuZhang' || USER_INFO.userRole == 'GuanLiYuan'){
                    label = {
                        // tickout: '<span style="color:#fff">淘汰审批：</span>有<span style="color:#F9FF00">#val#</span>头警犬申请淘汰，请及时审批;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.tickoutList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        // die: '<span style="color:#fff">死亡审批：</span>有<span style="color:#F9FF00">#val#</span>头警犬死亡，请审批死亡报告;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/apply.dieList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        work: '<span style="color:#fff">审批提醒：</span>您有<span style="color:#F9FF00">#val#</span>条警犬工作需要审批&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/adult.work" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        train: '<span style="color:#fff">培训提醒：</span>您有<span style="color:#F9FF00">#val#</span>头警犬即将到达培训日期，请关注培训信息，及时报名参加;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/train.createTrain" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    };
                }else if(USER_INFO.userRole == 'JingYuan' || USER_INFO.userRole == 'PeiXunRenYuan'){
                    label = {
                        train: '<span style="color:#fff">培训提醒：</span>您有<span style="color:#F9FF00">#val#</span>头警犬即将到达培训日期，请关注培训信息，及时报名参加;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/train.createTrain" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    };
                }else if(USER_INFO.userRole == 'FanZhiRenYuan'){
                    label = {
                        worm: '<span style="color:#fff">驱虫提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬需要进行驱虫处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/wormImmue.worm" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                        immue: '<span style="color:#fff">免疫提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬需要进行免疫处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/wormImmue.immue" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>',
                    };
                }
                label.eightYearsOld = '<span style="color:#fff">淘汰提醒：</span>有<span style="color:#F9FF00">#val#</span>头警犬的年龄超过8岁，请申请淘汰处理;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#!/app/adult.adultList" style="color:#F9FF00" class="gotoProcess" >立刻处理</a>';

                if(USER_INFO.userRole == 'JuZhang'){
                    label = [];
                }
                console.log(label);
                var isShow = false;
                var count = 0;
                for(var i = 0; i<arr.length; i++){
                    var item = arr[i];
                    if(item.att_name in label) {
                        isShow = true;
                        count += item.val;
                        html += '<div>' + label[item.att_name].replace('#val#', item.val) + '</div>';
                    }
                }
                html += '</div>';

                doIPost('notice/getList/1/1', {policeId: USER_INFO.id, isRead: 1}, function(data){
                    try {
                        count += data.pageVO.totalRows;
                    }catch(e){}
                    if(count > 99){
                        $$('todoTip').config.value = '99+';
                    }else {
                        $$('todoTip').config.value = count;
                    }
                    $$('todoTip').refresh();
                    if(isShow || count>0) {
                        var datatableId = webix.uid().toString();
                        var win = getWin('待办事项', {
                            rows: [
                                {
                                    height: 190,
                                    template: (isShow ? html : '无待办事项'), borderless: true, onClick: {
                                    gotoProcess: function () {
                                        win.close()
                                    }
                                }
                                },
                                {template: '<div style="font-size: 16px;color: #f9ff00;margin-top: -4px">收到的通知</div>', height: 30, borderless: true},
                                {
                                    id: datatableId,
                                    view: "datatable",
                                    tooltip: true,
                                    height: 210,
                                    datafetch: 6,
                                    columns: [
                                        {id: "$index", header: "NO.", width: 45},
                                        {
                                            id: 'isRead', header: '状态', width: 60, template: function (item) {
                                            return {
                                                "1": "<span style='color: #F9FF00'>未读</span>",
                                                "2": "已读"
                                            }[item.isRead] || "";
                                        }
                                        },
                                        {id: 'title', header: '标题', fillspace: 1},
                                        {
                                            id: 'creationDate',
                                            header: '日期',
                                            width: 110,
                                            format: webix.Date.dateToStr("%Y-%m-%d")
                                        },
                                        {
                                            header: "操作",
                                            template: function (item) {
                                                if(item.processLink && item.processLink != '0'){
                                                    return item.processLink;
                                                }
                                                if (item.isRead == 2) return '';
                                                return '<a href="javascript:void(0)" class="markRead">标记已读</a>';
                                            },
                                            tooltip: '标记已读',
                                            width: 78
                                        },
                                    ],
                                    customUrl: {
                                        url: webix.proxy('customProxy', '/policeDog/services/notice/getList/{pageSize}/{curPage}'),
                                        httpMethod: 'post',
                                        params: {policeId: USER_INFO.id},
                                        datatype: 'customJson'
                                    },
                                    onClick: {
                                        markRead: function (a, b, c) {
                                            var item = $$(datatableId).getItem(b.row);
                                            doIPost('notice/update', {id: item.id, isRead: 2}, function (resp) {
                                                $$(datatableId).reload();
                                            })
                                        },
                                        gotoProcess: function (a, b, c) {
                                            var item = $$(datatableId).getItem(b.row);
                                            doIPost('notice/update', {id: item.id, isRead: 2});
                                            win.close()
                                        }
                                    },
                                    pager: 'notice_page'
                                },
                                {
                                    view: "pager",
                                    id: "notice_page",
                                    size: 6,
                                    group: 5,
                                    template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>总共#count#条</div>"
                                }
                            ]
                        }, {width: 1000, height: 600});
                        win.show();
                    }
                    // }else{
                    //     msgBox('没有待办消息');
                    // }
                });
            }
        });
    };

    return {
        $ui: layout,
        $menu: "app:menu",
        $oninit: function (view, scope) {
            scope.ui(search.$ui);
            scope.ui(message.$ui);
            scope.ui(profile.$ui);
            window.onhashchange();
            var isShowTodoList = sessionStorage.getItem("showMyTodoList");
            showTodoList(isShowTodoList);
            sessionStorage.setItem("showMyTodoList", "false");
        }
    };

});