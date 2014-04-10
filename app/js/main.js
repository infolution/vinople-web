var s,
    VATAPI = {
        settings: {
            apiurl: 'http://api.vatapi.co',
            apikey: 'NNJfqcTQJt0Utw8Ry117yiiet2pM5k85'
//            apiurl: 'http://localhost:3000'
        },
        init: function () {
            s = this.settings;
            this.bindUIActions();
            this.checkSession();
            this.route();

        },
        bindUIActions: function () {
            $('#signup').submit(this.signup);
            $('#login').submit(this.login);
            $('#generateAPIKey').click(this.generateAPIKey);
            $('#example-calc-btn').click(this.exampleCalc);
        },
        checkSession: function () {
            var data = {clientid: window.sessionStorage.clientid, session: window.sessionStorage.session};
            if (typeof data.clientid !== 'undefined' && typeof data.session !== 'undefined') {
                $('#loginMenu').html('Logout').click(function (e) {
                    e.preventDefault();
                    delete window.sessionStorage.clientid;
                    delete window.sessionStorage.session;
                    $('#loginMenu').off('click');
                    window.location = '/';
                });
                var signupBtn = $('#signupMenu');
                signupBtn.html('Account').attr('href', '/account/');


            }
        },
        route: function () {
            var url = window.location.pathname.split('/')[1];
            if (url.indexOf('account') > -1) {
                this.loadAccountInfo();
            }
            if (url.indexOf('signup') > -1) {
                this.choosePlan();
            }
            if (url.indexOf('api') > -1) {
                hljs.initHighlightingOnLoad();
//        Foundation.init();
            }
        },

        //Handlers
        signup: function (e) {
            $('#status').html('Signing up...');

            e.preventDefault();
            var data = $('#signup').serialize();
            var password = $('#password').val();
            var salt = "vatapi";
            var mypbkdf2 = new PBKDF2(password, salt, 1, 64);
            var status_callback = function (percent_done) {
                $('#status').html("Computed " + percent_done + "%");
            };
            var result_callback = function (key) {
                data = data.replace("password=" + password, "password=" + key);
                $('#status').html("The derived key is: " + key);
                $.ajax({
                        url: s.apiurl + '/signup/',
                        data: data,
                        success: function (res) {
                            console.log('Response received. ' + res);
                            $('#status').html('Signup finished. Success: ' + res.success);
                        },
                        dataType: "jsonp",
                        jsonp: "callback"

                    }
                );
            };
            mypbkdf2.deriveKey(status_callback, result_callback);
        },
        login: function (e) {
            $('#status').html('Logging in...');

            e.preventDefault();
            var data = $('#login').serialize();
            var password = $('#password').val();
            var salt = "vatapi";
            var mypbkdf2 = new PBKDF2(password, salt, 1, 64);
            var status_callback = function (percent_done) {
                //$('#status').html("Computed " + percent_done + "%");
            };
            var result_callback = function (key) {
                data = data.replace("password=" + password, "password=" + key);
                //$('#status').html("The derived key is: " + key);
                $.ajax({
                        url: s.apiurl + '/login/',
                        data: data,
                        success: function (res) {
                            console.log('Response received. ' + res);
                            window.sessionStorage.clientid = res.clientid;
                            window.sessionStorage.session = res.session;
                            window.location = "/account/"
                        },
                        dataType: "jsonp",
                        jsonp: "callback"

                    }
                );
            };
            mypbkdf2.deriveKey(status_callback, result_callback);
        },
        generateAPIKey: function (e) {
            e.preventDefault();
            var data = {clientid: window.sessionStorage.clientid, session: window.sessionStorage.session};
            $.ajax({
                    url: s.apiurl + '/generateapi/',
                    data: data,
                    success: function (res) {
                        console.log('Response received. ' + res);
                        $('#apikey').html(res.apikey);
                    },
                    dataType: "jsonp",
                    jsonp: "callback"

                }
            );
        },
        exampleCalc: function (e) {
            $('#example-calc-status').html('Executing Calc method...');

            e.preventDefault();
            var amountcents = ~~($('#example-calc-amount').val() * 100);
            var data = {country: $('#example-calc-country').val(),
                amount: amountcents,
                apikey: s.apikey
            };

            $.ajax({
                    url: s.apiurl + '/calc/',
                    data: data,
                    success: function (res) {
                        console.log('Response received. ' + res);
                        $('#example-calc-status').html('');
                        $('#example-calc-response').html(JSON.stringify(res, null, " ")).each(function (i, e) {
                            hljs.highlightBlock(e)
                        });
                    },
                    dataType: "jsonp",
                    jsonp: "callback"

                }
            );
        },

        loadAccountInfo: function () {
            var data = {clientid: window.sessionStorage.clientid, session: window.sessionStorage.session};
            if (typeof data.clientid === 'undefined' && typeof data.session === 'undefined') {
                window.location = "/login/";
            } else {
                $.ajax({
                        url: s.apiurl + '/account/',
                        data: data,
                        success: function (res) {
                            console.log('Response received. ' + res);

                            $('#company').html(res.name);
                            $('#companyinfo .street-address').html(res.address);
                            $('#companyinfo .locality').html(res.city);
                            $('#companyinfo .zip').html(res.zip);
                            $('#companyinfo .state').html(res.state);
                            if (res.country !== '') {
                                var country = iso.findCountryByCode(res.country);
                                $('#companyinfo .country').html(country.name);
                            }
                            $('#apikey').html(res.apikey);
                            $('#useremail').html(res.email);
                        },
                        dataType: "jsonp",
                        jsonp: "callback"

                    }
                );
            }
        },
        choosePlan: function () {
            var hash = window.location.hash;
            if (hash !== "") {
                var chosenPlan = hash.substr(1);
                $('#plan').val(chosenPlan);
                window.location.hash = "";
            }
        }

    };


//App handler
(function () {

    VATAPI.init();


    //Init foundation
    $(document).foundation();

})();