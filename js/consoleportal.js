$(function () {

    let lang = Cookies.get("lang");
    if (!lang) {
        Cookies.set("lang", "fr", { expires: 30 });
        lang = Cookies.get("lang");
    }

    if (Cookies.get("inside")) {
        showPage();
    } else {
        $("body").addClass("portail");
        $("#loader").show();
    }


    $("#Input").focus()
    $(document).click(function () { $("#Input").focus() });

    var name = Cookies.get("nameCookie");

    addLine("<p class='eng'>Langage is set to english, to change it to french please use '/setlang fr' command.</p>");
    addLine("<p class='fr'>La langue actuelle est le français, pour la changer pour l'anglais utilisez la commande '/setlang eng'.</p>");
    if (name != undefined && name != null && name != "") {// Si le nom est déjà renseigné

        $("#username").html(name);

        //addLine("<p>> Type help to see a list of commands</p>");
        //eng
        addLine("<p class='eng'>Welcome to my portfolio !</p>");
        addLine("<p class='eng'>Oh it's " + name + " ! (☞ﾟヮﾟ)☞ How have you been ?</p>");
        addLine("<p class='eng'>You can enter by typing 'Enter'</p>");
        //fr

        addLine("<p class='fr'>Bienvenue sur mon portfolio !</p>");
        addLine("<p class='fr'>Oh mais c'est " + name + " ! (☞ﾟヮﾟ)☞ Comment ça va ?</p>");
        addLine("<p class='fr'>Vous pouvez entrer en tapant 'Enter'</p>");


    } else { //Pas de nom
        //eng
        addLine("<p class='eng'>Welcome to my portfolio !</p>");
        addLine("<p class='eng'>Is it the first time you come here ? (Or I just don't remember you... ¯\\_(ツ)_/¯ ).</p>");
        addLine("<p class='eng'>What's your name ?</p>");
        //fr

        addLine("<p class='fr'>Bienvenue sur mon portfolio !</p>");
        addLine("<p class='fr'>C'est la première fois que vous venez ici ? (Ou alors je ne me rappelle juste pas de vous... ¯\\_(ツ)_/¯ ).</p>");
        addLine("<p class='fr'>Quel est votre prénom ?</p>");
    }//class='"+managelang("eng")+"'



    setlang(lang);


    function addLine(str) {

        $("#dialog").append(str)
    }

    function enter(text) {
        if (text != "") {
            if (text.includes("<") || text.includes(">")) { //TODO : replace with a regex
                var str = "<p class='" + managelang("eng") + "'>> " + "Your HTML text" + "</br>" + "HTML text is not accepted" + "</p></br><p class='" + managelang("fr") + "'>> " + "Votre texte HTML" + "</br>" + "les textes HTML ne sont pas acceptés" + "</p>";
                addLine(str);
            } else {
                var response = ManageInput(text);
                if (response != null) {
                    var str = "<p>> " + text + "</br>" + response + "</p>";
                    addLine(str);
                }

            }

        }

    }

    function ManageInput(text) {

        if ((name == undefined || name == null || name == "") && (!text.includes("/setname ")) && (!text.includes("/setlang ")) && text != "cls" && text != "clear") {
            if (text.toString().length > 20) {
                return "<span class='" + managelang("eng") + "'>I'm afraid this name is a little bit too long :/ can you give me another one ?</span>" + "<span class='" + managelang("fr") + "'>Je crains que ce prénom ne soit un peu trop long pour mon cerveau de poisson rouge, pourriez vous m'en donner un autre ?</span>"
            }
            else {
                Cookies.set("nameCookie", text, { expires: 30 });
                name = Cookies.get("nameCookie");
                $("#username").html(name);
                return "<span class='" + managelang("eng") + "'>Nice to meet you " + name + " !</br>You can enter by typing 'Enter'.</span>" + "<span class='" + managelang("fr") + "'>Ravi de faire votre connaissance " + name + " !</br>Vous pouvez entrer en tapant la commande 'Enter'.</span>";

            }

        }
        else if (text == "enter" || text == "Enter" || text == "entrer" || text == "Entrer") {
            Cookies.set("inside", true, { expires: 1 });
            var myVar = setTimeout(showPage, 1250);
            return "<span class='" + managelang("eng") + "'>Welcome !</span>" + "<span class='" + managelang("fr") + "'>Bienvenue !</span>"; //enter the portfolio
        } else if (text.includes("/setname ")) {

            text = text.replace("/setname ", "");
            if (text == "" || text == " ") {
                return "<span class='" + managelang("eng") + "'>You didn't enter any value.</span>" + "<span class='" + managelang("fr") + "'>Vous n'avez renseigné aucune valeur.</span>";
            } else {
                Cookies.set("nameCookie", text, { expires: 30 });
                name = Cookies.get("nameCookie");
                $("#username").html(name);
                return "<span class='" + managelang("eng") + "'>Oh ! Okay, I'll call you " + name + " from now on.</br>You can enter by typing 'Enter'.</span>" + "<span class='" + managelang("fr") + "'>Oh ! D'accord, je vous appellerai " + name + " désormais.</br>Vous pouvez entrer en tapant la commande 'Enter'.</span>";
            }


        } else if (text.includes("/setlang ")) {
            text = text.replace("/setlang ", "");
            if (text == "fr" || text == "FR" || text == "french" || text == "français" || text == "francais") {
                Cookies.set("lang", "fr", { expires: 30 });
                lang = Cookies.get("lang");
                setlang(lang);
                return "<span class='" + managelang("eng") + "'>Let's use french then.</span>" + "<span class='" + managelang("fr") + "'>Parlons français alors.</span>";
            }
            else if (text == "eng" || text == "ENG" || text == "English" || text == "english" || text == "ENGLISH") {
                Cookies.set("lang", "eng", { expires: 30 });
                lang = Cookies.get("lang");
                setlang(lang);
                return "<span class='" + managelang("eng") + "'>Let's use english then.</span>" + "<span class='" + managelang("fr") + "'>Parlons anglais alors.</span>";
            } else {
                return "<span class='" + managelang("eng") + "'>Langage not recognised.</span>" + "<span class='" + managelang("fr") + "'>Langue non reconnue.</span>";
            }

        } else if (text == "clear" || text == "cls") {
            $("#dialog").html("");
            return null;
        }
        /*else if(text=="help")
        {
            return "'Enter' to enter.</br>'Help'  to have help with commands.</br>'/name  YOUR_NAME' to change you username"
        }*/
        else {
            return "<span class='" + managelang("eng") + "'>This command is not recognized.</span>" + "<span class='" + managelang("fr") + "'>Commande non reconnue.</span>"
        }
    }

    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            var temp = $("#Input").val()
            if (temp != undefined && temp != "" && temp != null) {
                enter(temp);
                $("#Input").val("")
            } else {
                addLine("<p>></p>");
            }

        }
    });


    $("#closeconsolebtn").click(function (event) {
        event.preventDefault();
        Cookies.set("inside", true, { expires: 1 });
        showPage();
    })

    function showPage() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("content").style.display = "block";
        $("body").removeClass('portail');
    }

    function managelang(l) {

        let cookie;

        if (Cookies.get("lang")) {
            cookie = Cookies.get("lang")
        } else {
            Cookies.set("lang", "eng", { expires: 30 });
            Cookies.get("lang")
        }
        if (l == Cookies.get("lang")) {
            return l;
        } else {
            let str = l + " none"
            return str;
        }
    }






    function setlang(lang) {
        if (lang === "fr") {
            var list = document.getElementsByClassName("eng");
            for (var i = 0; i < list.length; i++) {
                list.item(i).classList.add("none");
            }
            var list = document.getElementsByClassName("fr");
            for (var i = 0; i < list.length; i++) {
                list.item(i).classList.remove("none");
            }
        } else

            if (lang === "eng") {
                var list = document.getElementsByClassName("eng");
                for (var i = 0; i < list.length; i++) {
                    list.item(i).classList.remove("none");
                }
                var list = document.getElementsByClassName("fr");
                for (var i = 0; i < list.length; i++) {
                    list.item(i).classList.add("none");
                }
            }
    }

    Cookies.set("inside", true, { expires: 1 });
    showPage();
})
