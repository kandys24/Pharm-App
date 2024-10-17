
function getXMLHttpRequest() {  var xhr = null; if (window.XMLHttpRequest || window.ActiveXObject) {if (window.ActiveXObject) { try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) {xhr = new ActiveXObject("Microsoft.XMLHTTP");}} else {xhr = new XMLHttpRequest(); }} else {alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");return null;}return xhr;}



function register(form,name,email,pwd,pwd2,p,phone) {
    // Check each field has a value
   if (name.value == '' || email.value == '' || pwd.value == '' || pwd2.value == '' || phone.value=='') {
        $(name).css("border", "1.5px solid red");
        $(email).css("border", "1.5px solid red");
        $(pwd).css("border", "1.5px solid red");
        $(pwd2).css("border", "1.5px solid red");
        $(phone).css("border", "1.5px solid red");
        return false;
    }

    if(isNaN(phone.value)){
         $("#error").fadeOut(20).fadeIn(111).text('Este número de telefone não é válido.'); 
         $(phone).css("border", "1.5px solid red");
        return false;
    }



    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email.value)) {
        $("#error").fadeOut(20).fadeIn(111).text('Este email não é válido.'); 
        //$(email).css("border", "0.5px solid red");
        $(email).focus();
        return false;
    }
    
    if (pwd.value.length < 6) {
       var data = 'A sua palavra-passe deve conter no mínimo 6 caracteres';
        $('#error').text(data);
        $(email).css("border", "0.5px solid silver");
        $(pwd).css("border", "0.5px solid silver");
        $("#error").fadeOut(20).fadeIn(111).html(data); 
        form.pwd.focus();
        return false;
    }
    
    // At least one number, one lowercase and one uppercase letter 
    /* At least six characters 
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
    if (!re.test(usrpassword.value)) {
        alert('Passwords must contain at least one number, one lowercase and one uppercase letter.  Please try again');
        return false;
    }*/
    
    // Check password and confirmation are the same
    if (pwd.value != pwd2.value) {
        var data = 'Palavra-passe não idênticas';
        $('#error').text(data);
        $(email).css("border", "0.5px solid silver");
        $(pwd).css("border", "0.5px solid silver");
        $("#error").fadeOut(20).fadeIn(111).html(data); 
        form.pwd.focus();
        return false;
    }  
        
    // Create a new element input, this will be our hashed password field. 
    
    p =  hex_sha512(pwd.value);
    $("#l1").css("display", "none");
    $("#l2").css("display", "block");

 var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                if (donnee=='1') {
                 $('#btEnviar').hide();
                 $('#loader').show();
                 window.location= "register/email/"+email.value;
                }else{
                //console.log(donnee);
                $("#error").fadeOut(20).fadeIn(111).html(donnee); 
                }
            }
};
xhr.open("POST", "private/authentication/register.php?sslsudo_new", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("name="+ name.value +"&email="+email.value + "&pwd="+p+"&phone="+phone.value);
return true;
}




function clientlogin(form,email,pwd,p) {

   p = hex_sha512(pwd.value); 

    if (email.value == '' || pwd.value == '' ) {
        $(email).css("border", "1.5px solid red");
        $(pwd).css("border", "1.5px solid red");
        return false;
    }
    

// Make sure the plaintext password doesn't get sent.   
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee == true)
            {
            $('#error').hide();
            $(".authForm").hide();
            $(".auth").css("display", "block");
            $(email).css("border", "0.5px solid silver");
            $(pwd).css("border", "0.5px solid silver");
            window.location= "dashboard?news";
            }else{
            $('#error').text(donnee);
            $(email).focus();
            $(email).css("border", "0.5px solid silver");
            $(pwd).css("border", "0.5px solid silver");
            $("#error").fadeOut(20).fadeIn(111).html(donnee); 
            }
                   
        }
};
xhr.open("POST", "private/authentication/register.php?_sslportal", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("email="+ email.value +"&pwd="+p);
}







function passwordRecovery(form,email) {

 // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email.value)) {
        $("#error").fadeOut(20).fadeIn(111).text('Este email não é válido'); 
        //$(email).css("border", "0.5px solid red");
        $(email).focus();
        return false;
    }
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                if(donnee==1){
                 $('#btEnviar').hide();
                 $('#loader').show();
                 $('#R1').fadeOut().hide();
                 $('#R2').fadeIn().show();
                }else{
                $("#error").fadeOut(20).fadeIn(111).text(donnee); 
                }
              
            }
    };
xhr.open("POST", "private/authentication/register.php?sslpwd_Recovery", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("email="+email.value);
}




function alterPasswordRecovery(form,table,email,pwd,pwd2,p,token) {
    // Check each field has a value
   if (pwd.value == '' || pwd2.value == '') {
        $(pwd).css("border", "1.5px solid red");
        $(pwd2).css("border", "1.5px solid red");
        return false;
    }



    if (pwd.value.length < 6) {
       var data = 'A sua palavra-passe deve conter no mínimo 6 caracteres';
        $('#error').text(data);
        $(email).css("border", "0.5px solid silver");
        $(pwd).css("border", "0.5px solid silver");
        $("#error").fadeOut(20).fadeIn(111).html(data); 
        form.pwd.focus();
        return false;
    }
    
 
    // Check password and confirmation are the same
    if (pwd.value != pwd2.value) {
        var data = 'Palavra-passe não idênticas';
        $('#error').text(data);
        $(email).css("border", "0.5px solid silver");
        $(pwd).css("border", "0.5px solid silver");
        $("#error").fadeOut(20).fadeIn(111).html(data); 
        form.pwd.focus();
        return false;
    }  
        
    // Create a new element input, this will be our hashed password field. 
    
    p =  hex_sha512(pwd.value);
    $("#l1").css("display", "none");
    $("#l2").css("display", "block");

 var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                if (donnee) {
                    //alert(donnee);
                 window.location= "dashboard";
                }
            }
};
xhr.open("POST", "private/authentication/register.php?sslsudo_alterPasswordRecovery", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("table="+ table.value +"&email="+email.value + "&pwd="+p+"&token="+token.value);
return true;
}












function newitem(form,code,description,unity,price,iva,exemption_reason,pvp,retention) {

   if (code.value == '' || description.value == '' || price.value == '' || pvp.value == '' ) {
        $(code).css("border", "1.5px solid red");
        $(description).css("border", "1.5px solid red");
        $(price).css("border", "1.5px solid red");
        $(pvp).css("border", "1.5px solid red");
        return false;
    }
      
    if( iva.value == '0.00' && exemption_reason.value == 'Regime Geral' ){
        $(code).css("border", "1.5px solid  #ccc");
        $(description).css("border", "1.5px solid  #ccc");
        $(price).css("border", "1.5px solid  #ccc");
        $(pvp).css("border", "1.5px solid  #ccc");
        $("#exemption_reason").css("border", "1.5px solid red");
        $('.E05').show();
        return false;
    }
    
    if( price.value <= 0 ){
        $("#exemption_reason").css("border", "1.5px solid #ccc");
        $(price).css("border", "1.5px solid red");
        $('.E05').hide();
        $('.E06').show();
        return false;
    }
       
       
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            //alert(donnee);
            if(donnee=='Error')
            { 
              $('.E01').show();
              window.scrollTo(500, 0);
               $(code).css("border", "1.5px solid red");
              return false;

            }else{
            window.location= "items/"+donnee;
            }          
        }
};
//alert(retention);
price.value = price.value.replace(',','.');
xhr.open("POST", "private/includes/sql_insert.php?_newitem", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("code="+code.value+"&description="+description.value+"&unity="+unity.value+"&price="+price.value+"&iva="+iva.value+"&exemption_reason="+exemption_reason.value+"&pvp="+pvp.value+"&retention="+retention.value);

}



function insertcomment(form,c1,c2,c3,c4) {

    if (c4.value == '') {
        $(c4).focus();
        return false;
    }
      


var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { 
            $('#documentActivities').fadeOut(80).fadeIn(80).html(donnee);
           // window.location.reload(true);
            $('#c4Clear').val('');
            }          
        }
};
xhr.open("POST", "private/includes/sql_insert.php?_newcomment", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("c1="+c1.value+"&c2="+c2.value+"&c3="+c3.value+"&c4="+c4.value);
}




// CODE INSERTPAYMENT
function insertPayment(form,amount,date,pm,observations,docid,doctype,docnumber,serie,vref,fid,vencimento,cid,relid,pending) {
   
    if (amount.value == '' || amount.value == 0) {
        $(amount).focus();
        return false;
    }


    if (date.value == '') {
        $(date).focus();
        return false;
    }
    
    //alert(isNumeric(amount.value.replace(',','.')));
 
    if(Number(amount.value.replace(',','.')) > Number(pending.value.replace(',','.'))){
        $('#PaymentF1').show();
        return false;
    }


var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
             //alert(donnee);
            if(donnee)
            { 
          //alert(donnee);
          window.location.reload(true);
  
            }          
        }
};
 /*UPDATE 2020 CODE ADD : "&pending="+pending.value */
xhr.open("POST", "private/includes/sql_insert.php?_newPayment", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("amount="+amount.value+"&date="+date.value+"&pm="+pm.value+"&observations="+observations.value+"&docid="+docid.value+"&doctype="+doctype.value+"&dnumber="+docnumber.value+"&serie="+serie.value+"&vref="+vref.value+"&fid="+fid.value+"&vencimento="+vencimento.value+"&cid="+cid.value+"&relid="+relid.value+"&pending="+pending.value);
}






function updateitem(form,code,description,unity,price,iva,exemption_reason,pvp,id,itemnr,retention) {

    if (code.value == '' || description.value == '' || price.value == '' || pvp.value == '' ) {
        $(code).css("border", "1.5px solid red");
        $(description).css("border", "1.5px solid red");
        $(price).css("border", "1.5px solid red");
        $(pvp).css("border", "1.5px solid red");
        return false;
    }

     if( iva.value == '0.00' && exemption_reason.value == 'Regime Geral' ){
        $(exemption_reason).css("border", "1.5px solid red");
        $('.E05').show();
        return false;
    }
    
    if( price.value <= 0 ){
        $("#exemption_reason").css("border", "1.5px solid #ccc");
        $(price).css("border", "1.5px solid red");
        $('.E05').hide();
        $('.E06').show();
        return false;
    }
    
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee=='Error')
            { 
              $('.E01').show();
              window.scrollTo(500, 0);
               $(code).css("border", "1.5px solid red");
              return false;

            }else{
            window.location= "items/"+itemnr.value;
            }  
                 
        }
};
price.value = price.value.replace(',','.');
xhr.open("POST", "private/includes/sql_update.php?_updateitem", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("code="+code.value+"&description="+description.value+"&unity="+unity.value+"&price="+price.value+"&iva="+iva.value+"&exemption_reason="+exemption_reason.value+"&pvp="+pvp.value+"&id="+id.value+"&retention="+retention.value);
}



function updatelocal(form,table) {


      
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { //alert(donnee);
            window.location= "configurations.php?local&success";
            }        
        }
};
xhr.open("POST", "private/includes/sql_update.php?_updatelocal", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("table="+table.value);
}





function sendDocument(form,email,subject,message,doctab,docid,xcode_) {

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email.value)) {
        $('.EA01').show();
         $('#error').text("Este email não é válido.");
        //$(email).css("border", "0.5px solid red");
        $(email).focus();
        return false;
    }

        //validate email
    if(email_cc.value !=''){
    if (!emailre.test(email_cc.value)) {
       $('.EA01').show();
         $('#error').text("Este email não é válido.");
        $(email_cc).focus();
        window.scrollTo(500, 0);
        return false;
    }}

    if(email_bcc.value !=''){
    if (!emailre.test(email_bcc.value)) {
        $('.EA01').show();
         $('#error').text("Este email não é válido.");
        $(email_bcc).focus();
        window.scrollTo(500, 0);
        return false;
    }}

    var logo = $('.logoSRC').val();

    if(document.getElementById('send_email_copy').checked) {
    $copy = 1;
    }else{
    $copy = 0;
    }
      
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { //alert(donnee);
            location.reload(true);
            }        
        }
};
xhr.open("POST", "private/includes/sql_insert.php?_sendDocument", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("email="+email.value+"&subject="+encodeURIComponent(subject.value)+"&message="+encodeURIComponent(message.value)+"&doctab="+doctab.value+"&logo="+logo+"&docid="+docid.value+"&xcode_="+xcode_.value+"&cc="+email_cc.value+"&bcc="+email_bcc.value+"&copy="+$copy);
}





function supportMessage(form,subject,message,email) {

 if(subject.value == '' || message.value==''){
   $(subject).css("border", "1px solid red");
   $(message).css("border", "1px solid red");
        return false;
 } 
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { //alert(donnee);
            location.reload(true);
            }        
        }
};
xhr.open("POST", "private/includes/sql_insert.php?_supportMessage", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("&subject="+subject.value+"&message="+message.value+"&email="+email.value);
}




function updateTemplateM(form,doctab,email_cc,email_bcc,email_subject,email_message) {



    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
    if(email_cc.value !=''){
    if (!emailre.test(email_cc.value)) {
        $('#invalidE').show();
        $(email_cc).focus();
        window.scrollTo(500, 0);
        return false;
    }}

    if(email_bcc.value !=''){
    if (!emailre.test(email_bcc.value)) {
        $('#invalidE1').show();
        $(email_bcc).focus();
        window.scrollTo(500, 0);
        return false;
    }}

    if(document.getElementById('insert_logo').checked) {
    $logo = 1;
    }else{
    $logo = 0;
    }

    if(document.getElementById('send_email_copy').checked) {
    $copy = 1;
    }else{
    $copy = 0;
    }

    if(document.getElementById('send_current_account_link').checked) {
    $link = 1;
    }else{
    $link = 0;
    }
    

var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { 
            window.location= "configurations?templates&success";
            }        
        }
};
xhr.open("POST", "private/includes/sql_update.php?_updateTemplateM", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("doctab="+doctab.value+"&email_cc="+email_cc.value+"&email_bcc="+email_bcc.value+"&email_subject="+email_subject.value+"&email_message="+email_message.value+"&logo="+$logo+"&copy="+$copy+"&link="+$link);
}






function updateTemplateA(form,period,days,email_subject,email_message,recurrence_days) {


    if(document.getElementById('send_before_auto_email').checked) {
    $on = 1;
    }else{
    $on = 0;
    }

    if(document.getElementById('send_email_copy').checked) {
    $copy = 1;
    }else{
    $copy = 0;
    }
 
    
    if(period.value=='after'){


    if(document.getElementById('send_each').checked) {
    $send = 1;
    }else{
    $send = 0;
    }

    }else{
    $send = 0;
    }

var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { //alert(donnee);
            window.location= "configurations?alerts&success";
            }        
        }
};
xhr.open("POST", "private/includes/sql_update.php?_updateTemplateA", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("period="+period.value+"&days="+days.value+"&email_subject="+email_subject.value+"&email_message="+email_message.value+"&on="+$on+"&copy="+$copy+"&send="+$send+"&recurrence_days="+recurrence_days.value);
}




//Changed By ER, 24/12/2019 01:36
$("#UpdateAccountForm").off('submit');
           $("#UpdateAccountForm").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var name =$("input[name=name]").val();
    var fid = $("input[name=fid]").val();
    var address= $("input[name=address]").val();
    var pcode= $("input[name=pcode").val();
    var regime= $("select[name=regime").val();
    var city= $("input[name=city").val();
    var email= $("input[name=email").val();
    var com= $("input[name=com").val();
    var fax= $("input[name=fax").val();



     if (name == '' || fid =='' || address=='' || city=='') {
       // $(code).css("border", "1.5px solid red");
        $('.EA01').show();
        $('#error').text("Deve completar todos campos obrigatórios!");
        window.scrollTo(500, 0);
        return false;
    }

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email)) {
        $(".EA01").show();
        $("#error").text('Email inválido : '+email); 
        window.scrollTo(500, 0);
        $(email).focus();
        return false;
    }

   
                  $.ajax( {
                        url: "private/includes/sql_update.php?_updateaccount", // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(donnee) {
                            if (donnee=='E1') {

                $('.EA01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone inválido : '+ com);
                $(com).focus();
                return false;

                }if(donnee=='E2'){ 

                $('.EA01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone deve conter 9 dígitos : '+ com);
                $(com).focus();
                return false;

               }if(donnee=='E3'){ 

                $('.EA01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de fax inválido : '+ fax);
                $(com).focus();
                return false;
        
            }else{
             window.location= "configurations.php?account&success";
            }      
                        } 
                        
                    });
}));








function updatepers(form,observations,footer,send,vencimento,bankdata1,bankdata_1,bankdata__1,bankdata2,bankdata_2,bankdata__2,bankdata3,bankdata_3,bankdata__3) {


$bankdata1 = bankdata1.value;
$bankdata2 = bankdata2.value;
$bankdata3 = bankdata3.value;
//
if($bankdata1 == 'Outro'){
    $bankval1 = bankdata_1.value;
}else{
    $bankval1 = $bankdata1;
}//
if($bankdata2 == 'Outro'){
    $bankval2 = bankdata_2.value;
}else{
    $bankval2 = $bankdata2;
}//
if($bankdata3 == 'Outro'){
    $bankval3 = bankdata_3.value;
}else{
    $bankval3 = $bankdata3;
}
 
 if(document.getElementById('hideInfo').checked) {
    $hide = 1;
    }else{
    $hide = 0;
    }
/* function to submit ajax file data and form data
*/

$("#acc").off('submit'); /* very important in ajax calls, returns false and do not submit form when response is not met */
$("#acc").on('submit',(function(e) {
            e.preventDefault();
              $.ajax({
                url: "private/includes/sql_update.php?_updatepers="+observations.value+"&footer="+footer.value+"&send="+send.value+"&vencimento="+vencimento.value+"&bankdata1="+$bankval1+"&bankval1="+bankdata__1.value+"&bankdata2="+$bankval2+"&bankval2="+bankdata__2.value+"&bankdata3="+$bankval3+"&bankval3="+bankdata__3.value+"&hideInfo="+$hide,
                type: "POST",
                data:  new FormData(this),
                contentType: false,
                cache: false,
                processData:false,
                async : false, /* very important in ajax calls, returns false and do not submit form when response is not met */
                beforeSend: function(){
                    $('#updatepers').show();
                    $('#updatepers1').hide();
                },
                success: function(data){  
                  // console.log(data);
                    if (data == "1") {
                        //alert(data);
                        window.location= "configurations.php?personalization&success";
                    }else if(data == "E2"){
                        $('#updatepers1').show();
                        $('#updatepers').hide();
                        
                        $('.EA01').show();
                        $('#error').text("Não é possivel submeter uma imagem com tamanho superior a 300 KB.");
                    }else if(data == "E3"){
                        $('#updatepers1').show();
                        $('#updatepers').hide();
                        
                        $('.EA01').show();
                        $('#error').text("Formato inválido.");
                    } 
                },
                complete: function(){
                    $('#updatepers1').show();
                    $('#updatepers').hide();
                }
                        
              });
            }));
}  








function updateprofile(form,email,apassword,password,password2,p,prm,d,id) {

    if (apassword.value =='') {
        apassword.focus(); 
        return false;
    }

    if (password.value !='' && password.value.length < 6) {
        $('.E01').show();
        $('.E03').hide();
        $('.E02').hide();
        password.focus();
        $('.E01').fadeOut(20).fadeIn(111).html(data); 
        return false;
    }
    
    
    // Check password and confirmation are the same
    if (password.value != password2.value) {
        $('.E01').hide();
        $('.E03').hide();
        $('.E02').show();
        password.focus();
        $('.E02').fadeOut(20).fadeIn(111).html(data); 
        return false;
    } 

    p0 = apassword.value;
    d0 = password.value;
    p = hex_sha512(apassword.value); 
    d = hex_sha512(password.value); 


var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee == "1")
            {
            window.location= "dashboard";
            }else if(donnee=="no match"){
            $('.E01').hide();
            $('.E02').hide();
            $('.E03').show();
            apassword.focus();
            $('.E03').fadeOut(20).fadeIn(111).html(data); 
            return false;
            }else{
            $('.E04').show();
            window.scrollTo(500, 0);
            $('#Errorinfo').text(donnee);

            }        
        }
};
xhr.open("POST", "private/includes/sql_update.php?_updateprofile", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("email="+email.value+"&p="+p+"&d="+d+"&prm="+prm.value+"&id="+id.value+"&p0="+p0+"&d0="+d0);
}


function deleteitem(form,id) {
    var id = id.value;
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                window.location= "./items?list";
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deleteitem", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
}



function deleteLogo(form,id) {
    var id = id.value;
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                 location.reload(true);
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deleteLogo", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
}



function deleteuser(form,id) {
    var id = id.value;
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                location.reload(true);
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deleteuser", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
}







function deletetax(form,id) {
    var id = id.value;

    var countInvoiceTotal = $('.countTax'+id).val();
    var countItemTotal = $('.countItemTax'+id).val();


    if(countInvoiceTotal>=1){

    window.location= "configurations?taxes&deletestatus=0";

    } else if(countItemTotal>=1){

    window.location= "configurations?taxes&deletestatus=0";

    }else{

    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                window.location= "configurations/taxes";

            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deletetax", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
 }//end count
}




function clearaccount(form,id) {
    var id = id.value;
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
             //alert(donnee); 
             location.reload(true);
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?clearaccount", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
}



function deleteAccount_Main(form,id) {
    var id = id.value;
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
             //alert(donnee); 
             location.reload(true);
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deleteAccount_Main", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
}


function deleteclient(form,id) {

    var id = id.value;

    var countInvoiceTotal = $('#countInvoiceTotal').val();
    var Id = $('#countInvoiceTotal').data('id');

    if(countInvoiceTotal>=1){

    window.location= "clients/?client="+Id+"&deletestatus=0";

    }else{
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                window.location= "clients?list";
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deleteclient", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
    }// end count..
}






function eraseDraft(form,id,type) {
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                if(donnee=='Proformas'){
                window.location= "proformas?list";   
                }else if(donnee=='guide'){
                window.location= "guides?list";   
                }else if(donnee=='order'){
                window.location= "orders?list";
                }else if(donnee=='deliverys'){
                window.location= "orders?list";  
                }else{
                window.location= "invoices?list";     
                }

            }
    };
xhr.open("POST", "private/includes/sql_delete.php?eraseDraft", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id.value+"&type="+type.value);
}





function cancelDoc(form,id,type,cancel_r) {
     if (cancel_r.value =='') {
        cancel_r.focus(); 
        return false;
    }


    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;//alert(donnee);
                if(donnee){
                 location.reload(true);  
                }
            }
    };
xhr.open("POST", "private/includes/sql_update.php?cancelDoc", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id.value+"&type="+type.value+"&cancel_r="+cancel_r.value);
}









function bulkarchive(form,type) {

    var nodes = document.getElementsByClassName("itemSelectionCheckbox");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }


    if (checkedValues == 0) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Não foram selecionados documentos.');
        return false;
    }
    
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;//alert(donnee);
                if(donnee=='1'){
                window.location.reload(true);      
                }else{
                $('#M01').hide(); 
                $('#M02').hide(); 
                $('.EC01').show();
                 window.scrollTo(500, 0);
                 $('#txt').text(donnee);
                 return false;
                }
            }
    };
xhr.open("POST", "private/includes/sql_update.php?_bulkarchiveIds", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+checkedValues+"&type="+type.value);
$('#M01').show(); 
$('#M02').show();
}



function bulkunarchive(form,type) {

    var nodes = document.getElementsByClassName("itemSelectionCheckbox");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }



     if (checkedValues == 0) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Não foram selecionados documentos.');
        return false;
    }


    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;//alert(donnee);
                if(donnee=='1'){
                window.location.reload(true);      
                }else{
                $('#M01').hide(); 
                $('#M02').hide(); 
                $('.EC01').show();
                 window.scrollTo(500, 0);
                 $('#txt').text(donnee);
                 return false;
                }
            }
    };
xhr.open("POST", "private/includes/sql_update.php?_bulkunarchiveIds", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+checkedValues+"&type="+type.value);
$('#M01').show(); 
$('#M02').show();
}







/* SCRIPT AGENDADOR 2023 */
function bulkarchivecontacts(form,docid,contact_group) {

    var nodes = document.getElementsByClassName("itemSelectionCheckbox");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }


    if (checkedValues == 0) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Não foram selecionados contactos.');
        return false;
    }
    
 
    if (contact_group.value == '') {
        $(contact_group).css("border", "1.5px solid red");
        $('#error').text("Existem campos obrigatórios.");
        return false;
    }
  
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;//alert(donnee);
                if(donnee=='1'){
                window.location.reload(true);      
                }else{
                $('#M01').hide(); 
                $('#M02').hide(); 
                $('.EC01').show();
                 window.scrollTo(500, 0);
                 $('#txt').text(donnee);
                 return false;
                }
            }
    };
xhr.open("POST", "private/includes/sql_update.php?_bulkarchiveIds_contacts", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+checkedValues+"&docid="+docid.value+"&contact_group="+contact_group.value);
$('#M01').show(); 
$('#M02').show();
}


function bulkunarchivecontacts(form,docid) {

    var nodes = document.getElementsByClassName("itemUnSelectionCheckbox");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }


    if (checkedValues == 0) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Não foram selecionados contactos.');
        return false;
    }

  
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;//alert(donnee);
                if(donnee=='1'){
                window.location.reload(true);      
                }else{
                $('#M01').hide(); 
                $('#M02').hide(); 
                $('.EC01').show();
                 window.scrollTo(500, 0);
                 $('#txt').text(donnee);
                 return false;
                }
            }
    };
xhr.open("POST", "private/includes/sql_update.php?_bulkarchiveIds_contacts_del", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+checkedValues+"&docid="+docid.value);
$('#M01').show(); 
$('#M02').show();
}









//NEW AGENDAMENT
$("#newAgendamento").off('submit');
            $("#newAgendamento").on('submit',(function(e) {
       
                     e.preventDefault();
                     var formData = new FormData($(this)[0]);
       
       var _semImposto = $(".to_compareSImposto").attr("dir");
        var _comImposto = $(".to_compareImposto").attr("dir");
        var _incidencia = $("._incidencia").attr("dir");
        var _valorX     = $("._valorX").attr("dir");
        
       
       if( _semImposto != _incidencia && _comImposto != _valorX ){
            $("#btnRascunho").removeProp("disabled");
            $('.EI03').show();
            $("#error").text("A sua ligação está lenta, por favor clique em guardar novamente.");
            return false;
                
       }

        var type1= $("input[name=type1").val();
        
        
        
        var documentX = $("select[name=document]").val();
        var status_document = $("input[name=status_document]").val();
        var descricao = $("input[name=descricao]").val();
        var groupcontact = $("select[name=groupcontact]").val();
        var datasend = $("select[name=datasend]").val();
        
     
        
         var _originalType= $("input[name=_originalType").val();
        type1 = ( _originalType === 'invoicesauto' ? 'invoicesauto'  : type1  );
       

        var itemDescription = $('.itemDescription').val();
        var itemUnitPrice = $('.itemUnitPrice').val();
        var itemQuantity = $('.itemQuantity').val();
        var itemTax = $('.itemTax').val();
     

  
        if(documentX==''  || status_document==''  || descricao==''  || groupcontact==''  || datasend==''  ||  itemDescription == '' ||  itemUnitPrice == '' ||  itemQuantity == '' ||  itemTax == '' ){
        
         //$("input[name=name]").css("border", "1.5px solid red");
         $(".itemDescription").css("border", "1.5px solid red");
         $(".itemUnitPrice").css("border", "1.5px solid red");
         $(".itemQuantity").css("border", "1.5px solid red");
         $(".itemTax").css("border", "1.5px solid red");

         $("select[name=document]").focus();
         
         
         $("select[name=document]").css("border", "1.5px solid  red");
         $("input[name=status_document]").css("border", "1.5px solid red");
         $("input[name=descricao]").css("border", "1.5px solid red");
         $("select[name=groupcontact]").css("border", "1.5px solid  red");
         $("input[name=datasend]").css("border", "1.5px solid  red");
         
         $('.EI03').show();
         $("#error").text('Existem campos obrigatórios.');
       
        $(window).click(function(){
            
             $("input[name=document]").css("border", "1.5px solid #ccc");
             $(".itemDescription").css("border", "1.5px solid  #ccc");
             $(".itemUnitPrice").css("border", "1.5px solid  #ccc");
             $(".itemQuantity").css("border", "1.5px solid  #ccc");
             $(".itemTax").css("border", "1.5px solid  #ccc");

             
             $("select[name=document]").css("border", "1.5px solid  #ccc");
             $("input[name=status_document]").css("border", "1.5px solid #ccc");
             $("input[name=descricao]").css("border", "1.5px solid #ccc");
             $("select[name=groupcontact]").css("border", "1.5px solid  #ccc");
             $("input[name=datasend]").css("border", "1.5px solid #ccc");
                 
        });
        
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
         return false;
        }
        /*END NEW UPDATE LINE*/
        var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }
       
      // return false;
         /*UPDATE 2020 CODE*/       
        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
       
 
       
        var i = 0;
        $(".items").each(function () { i++; });
       
        if(i==0){
        $('.EI03').show();
        $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
         return false;
        }

            // VERIFICAR A DATA DA ULTIMA FACTURA
            var dataChoise = $("input[name=idate]").val();
            var serieChoise = $("#serie_choice option:selected").val();
            var typeDoc =  $("input[name=type]").val();


            $.ajax( {
                 url: "private/includes/sql_insert.php?_comparedata&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Data não pode ser anterior à do último documento.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                       
                  // -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
                $.ajax( {
                 url: "private/includes/sql_insert.php?_fivedayspast&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                     console.log(response);
                    // return false;
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data da factura não pode ser inferior a 5 dias da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                        
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
                

            
            

           $.ajax( {
                 url: "private/includes/sql_insert.php?_newAgendamento&documentX="+documentX+"&items="+items, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: formData,
                  processData: false,
                     contentType: false,

                 success: function(response) {
                     //console.log(response);
                     //$("#btnRascunho").removeProp("disabled");
                     //return false;
                      if(response=='E1'){
    
                     $('.EI03').show();
                     $("input[name=name]").focus();
                     window.scrollTo(500, 0);
                     $('#error').text('Este nome não está disponível.');
                     $("#btnRascunho").removeProp("disabled");
                     return false;

                      }else if(response=='E2x'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data de vencimento não pode ser inferior á da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                         
                    }else if(response=='E11'){ 
    
                         $('.EI03').show();
                         $("input[name=name]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Contribuinte não está disponível.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                
                   }else{//alert(response);
                   window.location= "agendador?list";
                     }  
                 }
                
             });// END AJAX QUERY
            
                    }
                 }
            });
            // END -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
            
                    }  
                 }
                
                
             });// END COMPARE DATA SCRIPT
            
            
        }));// END SCRIPT AGENDAMENT


//EDIT AGENDAMENT
$("#editAgendament").off('submit');
            $("#editAgendament").on('submit',(function(e) {
       
                     e.preventDefault();
                     var formData = new FormData($(this)[0]);
       
       var _semImposto = $(".to_compareSImposto").attr("dir");
        var _comImposto = $(".to_compareImposto").attr("dir");
        var _incidencia = $("._incidencia").attr("dir");
        var _valorX     = $("._valorX").attr("dir");
        
       
       if( _semImposto != _incidencia && _comImposto != _valorX ){
            $("#btnRascunho").removeProp("disabled");
            $('.EI03').show();
            $("#error").text("A sua ligação está lenta, por favor clique em guardar novamente.");
            return false;
                
       }
       

        var type1= $("input[name=type1").val();
        
        
        
        var documentX = $("select[name=document]").val();
        var status_document = $("input[name=status_document]").val();
        var descricao = $("input[name=descricao]").val();
        var groupcontact = $("select[name=groupcontact]").val();
        var datasend = $("select[name=datasend]").val();
        

        
         // --  STOP.         
        
         var _originalType= $("input[name=_originalType").val();
        type1 = ( _originalType === 'invoicesauto' ? 'invoicesauto'  : type1  );
       
       
        /*UPDATE 2020 CODE*/

        //var fiscal_id = $('.fiscal_id').val();
        var itemDescription = $('.itemDescription').val();
        var itemUnitPrice = $('.itemUnitPrice').val();
        var itemQuantity = $('.itemQuantity').val();
        var itemTax = $('.itemTax').val();
     

  
        if(documentX==''  || status_document==''  || descricao==''  || groupcontact==''  || datasend==''  ||   itemDescription == '' ||  itemUnitPrice == '' ||  itemQuantity == '' ||  itemTax == '' ){
        
         //$("input[name=name]").css("border", "1.5px solid red");
         $(".itemDescription").css("border", "1.5px solid red");
         $(".itemUnitPrice").css("border", "1.5px solid red");
         $(".itemQuantity").css("border", "1.5px solid red");
         $(".itemTax").css("border", "1.5px solid red");

         $("select[name=document]").focus();
         
         
         $("select[name=document]").css("border", "1.5px solid  red");
         $("input[name=status_document]").css("border", "1.5px solid red");
         $("input[name=descricao]").css("border", "1.5px solid red");
         $("select[name=groupcontact]").css("border", "1.5px solid  red");
         $("input[name=datasend]").css("border", "1.5px solid  red");
         
         
         $('.EI03').show();
         $("#error").text('Existem campos obrigatórios.');
       
        $(window).click(function(){
            
             $("input[name=document]").css("border", "1.5px solid #ccc");
             $(".itemDescription").css("border", "1.5px solid  #ccc");
             $(".itemUnitPrice").css("border", "1.5px solid  #ccc");
             $(".itemQuantity").css("border", "1.5px solid  #ccc");
             $(".itemTax").css("border", "1.5px solid  #ccc");

             
             $("select[name=document]").css("border", "1.5px solid  #ccc");
             $("input[name=status_document]").css("border", "1.5px solid #ccc");
             $("input[name=descricao]").css("border", "1.5px solid #ccc");
             $("select[name=groupcontact]").css("border", "1.5px solid  #ccc");
             $("input[name=datasend]").css("border", "1.5px solid #ccc");
                 
        });
        
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
         return false;
        }
        /*END NEW UPDATE LINE*/
        var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }
       
      // return false;
         /*UPDATE 2020 CODE*/       
        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });

       
        var i = 0;
        $(".items").each(function () { i++; });
       
        if(i==0){
        $('.EI03').show();
        $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
         return false;
        }

            // VERIFICAR A DATA DA ULTIMA FACTURA
            var dataChoise = $("input[name=idate]").val();
            var serieChoise = $("#serie_choice option:selected").val();
            var typeDoc =  $("input[name=type]").val();


            $.ajax( {
                 url: "private/includes/sql_insert.php?_comparedata&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Data não pode ser anterior à do último documento.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                       
                  // -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
                $.ajax( {
                 url: "private/includes/sql_insert.php?_fivedayspast&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                     console.log(response);
                    // return false;
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data da factura não pode ser inferior a 5 dias da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                        
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
                

            
            

           $.ajax( {
                 url: "private/includes/sql_insert.php?_editAgendamento&documentX="+documentX+"&items="+items, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: formData,
                  processData: false,
                     contentType: false,

                 success: function(response) {
                     //console.log(response);
                     //$("#btnRascunho").removeProp("disabled");
                     //return false;
                      if(response=='E1'){
    
                     $('.EI03').show();
                     $("input[name=name]").focus();
                     window.scrollTo(500, 0);
                     $('#error').text('Este nome não está disponível.');
                     $("#btnRascunho").removeProp("disabled");
                     return false;

                      }else if(response=='E2x'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data de vencimento não pode ser inferior á da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                         
                    }else if(response=='E11'){ 
    
                         $('.EI03').show();
                         $("input[name=name]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Contribuinte não está disponível.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                
                   }else{//alert(response);
                   window.location= "agendador?list";
                     }  
                 }
                
             });// END AJAX QUERY
            
                    }
                 }
            });
            // END -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
            
                    }  
                 }
                
                
             });// END COMPARE DATA SCRIPT
            
            
        }));// END SCRIPT AGENDAMENT



$(document).on("click", "#agendamentAtive", function () {
     var str = $(this).data('id');

     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
     $.ajax({url:"private/includes/sql_update.php?agendamenAtive&id="+str,cache:false,
      beforeSend: function(){
      $("#agendamentAtive").css("display", "none");
      $("#invoicesettled2").css("display", "block");
      },
      complete: function(){
      $("#agendamentAtive").css("display", "none");
      $("#invoicesettled2").css("display", "block");
      },
      success:function(result){
         
      location.reload(true);
     
        }});
});

$(document).on("click", "#agendamentDesative", function () {
     var str = $(this).data('id');

     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
     $.ajax({url:"private/includes/sql_update.php?agendamenDesative&id="+str,cache:false,
      beforeSend: function(){
      $("#agendamentDesative").css("display", "none");
      $("#invoicesettled2").css("display", "block");
      },
      complete: function(){
      $("#agendamentDesative").css("display", "none");
      $("#invoicesettled2").css("display", "block");
      },
      success:function(result){
         
      location.reload(true);
     
        }});
});



$(document).on("click", "#MKeraseAgendament", function () {
     var Id = $(this).data('id');

     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
       $.ajax({url:"includes/.modals.php?MKeraseAgendament="+Id,cache:false,success:function(result){
     $("#eraseModal").html(result);
        }});
});


function deleteAgendament(form,id) {

    var id = id.value;

    
    // Check each field has a value
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                window.location= "agendador?list";
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?deleteAgendament", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+id);
    
}







function bulkerase(form,type) {

    var nodes = document.getElementsByClassName("itemSelectionCheckbox");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }

    if (checkedValues == 0) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Não foram selecionados documentos.');
        return false;
    }
    

    
    var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;//alert(donnee);
                if(donnee=='1'){
                window.location.reload(true);      
                }else{
                $('#M01').hide(); 
                $('#M02').hide(); 
                $('.EC01').show();
                 window.scrollTo(500, 0);
                 $('#txt').text(donnee);
                 return false;
                }
            }
    };
xhr.open("POST", "private/includes/sql_delete.php?_bulkeraseIds", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("id="+checkedValues+"&type="+type.value);
$('#M01').show(); 
$('#M02').show();
}








function bulkpdf(form,type) {

    var nodes = document.getElementsByClassName("itemSelectionCheckbox");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }


    var type = [],
    length = nodes.length,
    i = 0;


    for(i;i<length;i++){
    if(nodes[i].checked)
    type.push(nodes[i].name);
    }



    if (checkedValues == 0) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Não foram selecionados documentos.');
        return false;
    }
    
    //count total checkboxes selected
    var x = document.getElementsByClassName("itemSelectionCheckbox");
    var p = 0;
    for(var i=0; i< x.length; i++){
        if(x[i].checked)
        p++
    }

    if (p > 1) {
        $('.EC01').show();
        window.scrollTo(500, 0);
        $('#txt').text('Por favor selecione um documento de cada vez.');
        return false;
    }

      $.ajax({url:"pdf/"+type+"/"+checkedValues,cache:false,
      beforeSend: function(){
      $('.EC01').hide();
      $('#M01').show(); 
      $('#M02').show();
      },
      complete: function(){
      $('#M01').hide();
      $('#M02').hide();
      },
      success:function(result){
      window.location="pdf/"+type+"/"+checkedValues;
      }});

}








function removeMulticlients(form) {
    //
    var nodes = document.getElementsByClassName("unidadesArray2");
    var checkedValues = [],
    length = nodes.length,
    i = 0;

    for(i;i<length;i++){
    if(nodes[i].checked)
    checkedValues.push(nodes[i].value);
    }

    if (checkedValues == 0) {
        alert('Por favor selecione um contacto para remover');
        return false;
    }
    if (confirm("Tem a certeza que deseja apagar este(s) cliente? Esta operação não é reversível.")) {
     // it is superfluous to have to manually call the modal.
     // $('#addBookDialog').modal('show');
       $.ajax({url:"private/includes/sql_delete.php?midclient="+checkedValues,cache:false,success:function(result){
           //  alert(result);
             location.reload(true);
        }});
       // alert(result);
       location.reload(true);
       }
    return false;
}




$("#NewClient").off('submit');
           $("#NewClient").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var name =$("input[name=name]").val();
    var address = $('#client_address').val();
    var contact_attributes_email = $("input[name=contactemail]").val();
    var country= $("input[name=country").val();
    var city= $("input[name=city").val();
     var email= $("input[name=email").val();
     var city2= $("select[name=city2").val();
    
    if (name == '' || address == '' || ( city == '' && city2 == '' ) ) {
        $("input[name=name]").css("border", "1.5px solid red");
        $("#client_address").css("border", "1.5px solid red");
        $("select[name=city]").css("border", "1.5px solid red");
        $("select[name=city2]").css("border", "1.5px solid red");
        $("input[name=name]").focus();
        $('.EC01').show();
        $("#error").text('Existem campos obrigatórios.'); 
        window.scrollTo(500, 0);
        return false;
    }      

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email) && email!='') {
        $(".EC01").show();
        $("#error").text('Email inválido : '+email); 
        window.scrollTo(500, 0);
        $("input[name=email").focus();
        return false;
    }


    //validate email
     if (!emailre.test(contact_attributes_email) && contact_attributes_email!='') {
        $(".EC01").show();
        $("#error").text('Email inválido : '+contact_attributes_email); 
       $("input[name=contactemail]").focus();
        window.scrollTo(500, 0);
        return false;
    }




    if($("select[name=country").val()=='Angola'){
       var cidade = $("select[name=city2").val();
    }else{
       var cidade =$("input[name=city").val();
    }
    
    if(document.getElementById('account_invoicing_config').checked) {
    var config = 1;
    }else{
    var config = 0;
    }


   
                  $.ajax( {
                        url: "private/includes/sql_insert.php?_newclient="+config+"&city="+cidade, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(donnee) {
                            if (donnee=='E1') {

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone inválido : '+ $("input[name=phonec]").val());
                 $("input[name=phonec]").focus();
                return false;

                }else if(donnee=='E2'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel inválido : '+  $("input[name=mobilec]").val());
                $("input[name=mobilec]").focus();
                return false;

                }else if(donnee=='E3'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de fax inválido');
                $("input[name=fax]").focus();
                return false;

                }else if(donnee=='E4'){ 

                $('.EC01').show();
                $("input[name=contactphoneclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone inválido : '+  $("input[name=contactphoneclean]").val());
                return false;

                }else if(donnee=='E5'){ 

                $('.EC01').show();
               $("input[name=contactmobileclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel inválido : '+ $("input[name=contactmobileclean]").value());
                return false;

                }else if(donnee=='E6'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone deve conter 9 dígitos : '+  $("input[name=phonec]").val());
                 $("input[name=phonec]").focus();
                return false;


                }else if(donnee=='E7'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel deve conter 9 dígitos : '+$("input[name=mobilec]").val());
                $("input[name=mobilec]").focus();
                return false;

                }else if(donnee=='E8'){ 

                $('.EC01').show();
                $("input[name=contactphoneclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone do contacto preferencial deve conter 9 dígitos : '+ $("input[name=contactphoneclean]").val());
                return false;

               }else if(donnee=='E9'){ 

                $('.EC01').show();
                $("input[name=contactmobileclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel do contacto preferencial deve conter 9 dígitos : '+ $("input[name=contactmobileclean]").val());
                return false;

               }else if(donnee=='E10'){ 

                $('.EC01').show();
                //$(contact_attributes_mobileclean).focus();
                window.scrollTo(500, 0);
                $('#error').text('Nome não está disponível.');
                return false;
               }else if(donnee=='E11'){ 

                $('.EC01').show();
                //$(contact_attributes_mobileclean).focus();
                window.scrollTo(500, 0);
                $('#error').text('Contribuinte não está disponível.');
                return false;
                
               }else if(donnee=='E12'){ 

                $('.EC01').show();
                //$(contact_attributes_mobileclean).focus();
                window.scrollTo(500, 0);
                $('#error').text('Campo nome em branco.');
                return false;

            }else{//alert(donnee);
          window.location= "clients/"+donnee;
            }        
                        } 
                        
                    });
}));













$("#updateClient").off('submit');
           $("#updateClient").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var name =$("input[name=name]").val();
    var address = $('#client_address').val();
    var contact_attributes_email = $("input[name=contactemail]").val();
    var country= $("input[name=country").val();
    var city= $("input[name=city").val();
     var email= $("input[name=email").val();
     var city2= $("select[name=city2").val();


    if (name == '' || address == '' || city == '' || ( city == '' && city2 == '' ) ) {//
        $("input[name=name]").css("border", "1.5px solid red");
        $("#client_address").css("border", "1.5px solid red");
        $("input[name=city]").css("border", "1.5px solid red");
        $("select[name=city2]").css("border", "1.5px solid red");
        $("input[name=name]").focus();
        $('.EC01').show();
        $("#error").text('Existem campos obrigatórios.'); 
        window.scrollTo(500, 0);
        return false;
    }      

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email) && email!='') {
        $(".EC01").show();
        $("#error").text('Email inválido : '+email); 
        window.scrollTo(500, 0);
        $("input[name=email").focus();
        return false;
    }


    //validate email
     if (!emailre.test(contact_attributes_email) && contact_attributes_email!='') {
        $(".EC01").show();
        $("#error").text('Email inválido : '+contact_attributes_email); 
       $("input[name=contactemail]").focus();
        window.scrollTo(500, 0);
        return false;
    }




    if(document.getElementById('account_invoicing_config').checked) {
    var config = 1;
    }else{
    var config = 0;
    }


   
                  $.ajax( {
                        url: "private/includes/sql_update.php?_updateclient="+config, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(donnee) {
                            if (donnee=='E1') {

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone inválido : '+ $("input[name=phonec]").val());
                 $("input[name=phonec]").focus();
                return false;

                }else if(donnee=='E2'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel inválido : '+  $("input[name=mobilec]").val());
                $("input[name=mobilec]").focus();
                return false;

                }else if(donnee=='E3'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de fax inválido');
                $("input[name=fax]").focus();
                return false;

                }else if(donnee=='E4'){ 

                $('.EC01').show();
                $("input[name=contactphoneclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone inválido : '+  $("input[name=contactphoneclean]").val());
                return false;

                }else if(donnee=='E5'){ 

                $('.EC01').show();
               $("input[name=contactmobileclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel inválido : '+ $("input[name=contactmobileclean]").value());
                return false;

                }else if(donnee=='E6'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone deve conter 9 dígitos : '+  $("input[name=phonec]").val());
                 $("input[name=phonec]").focus();
                return false;


                }else if(donnee=='E7'){ 

                $('.EC01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel deve conter 9 dígitos : '+$("input[name=mobilec]").val());
                $("input[name=mobilec]").focus();
                return false;

                }else if(donnee=='E8'){ 

                $('.EC01').show();
                $("input[name=contactphoneclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telefone do contacto preferencial deve conter 9 dígitos : '+ $("input[name=contactphoneclean]").val());
                return false;

               }else if(donnee=='E9'){ 

                $('.EC01').show();
                $("input[name=contactmobileclean]").focus();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel do contacto preferencial deve conter 9 dígitos : '+ $("input[name=contactmobileclean]").val());
                return false;

               }else if(donnee=='E10'){ 

                $('.EC01').show();
                //$(contact_attributes_mobileclean).focus();
                window.scrollTo(500, 0);
                $('#error').text('Nome não está disponível.');
                return false;
                
               }else if(donnee=='E11'){ 

                $('.EC01').show();
                //$(contact_attributes_mobileclean).focus();
                window.scrollTo(500, 0);
                $('#error').text('Contribuinte não está disponível.');
                return false;
                
               }else if(donnee=='E12'){ 

                $('.EC01').show();
                //$(contact_attributes_mobileclean).focus();
                window.scrollTo(500, 0);
                $('#error').text('Campo nome em branco.');
                return false;

            }else{//alert(donnee);
          window.location= "clients/"+donnee;
            }        
                        } 
                        
                    });
}));







/*
var name =$("input[name=name]").val();
    var address = $('#client_address').val();
    var contact_attributes_email = $("input[name=contactemail]").val();
    var country= $("input[name=country").val();
    
     var email= $("input[name=email").val();
     
     
if (name == '' || address == '' || ( city == '' && city2 == '' ) ) {
        $("input[name=name]").css("border", "1.5px solid red");
        $("#client_address").css("border", "1.5px solid red");
        $("select[name=city]").css("border", "1.5px solid red");
        $("select[name=city2]").css("border", "1.5px solid red");
        $("input[name=name]").focus();
        $('.EC01').show();
        $("#error").text('Existem campos obrigatorios.'); 
        window.scrollTo(500, 0);
        return false;
    } */



$(".due_date_choice").change(function(){
    var valueSelected = this.value;
   function adicionarDiasData(dias){
      var hoje        = new Date();
      var dataVenc    = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000));
      return dataVenc.getDate() + "/" + (dataVenc.getMonth() + 1) + "/" + dataVenc.getFullYear();
    }
     
    var novaData = adicionarDiasData(valueSelected);
    $(".estimateDate").empty().text(novaData);

});            
  
//NEW INVOICES
$("#newInvoices").off('submit');
            $("#newInvoices").on('submit',(function(e) {
       
                     e.preventDefault();
                     var formData = new FormData($(this)[0]);
       
       var _semImposto = $(".to_compareSImposto").attr("dir");
        var _comImposto = $(".to_compareImposto").attr("dir");
        var _incidencia = $("._incidencia").attr("dir");
        var _valorX     = $("._valorX").attr("dir");
        
       
       if( _semImposto != _incidencia && _comImposto != _valorX ){
            $("#btnRascunho").removeProp("disabled");
            $('.EI03').show();
            $("#error").text("A sua ligação está lenta, por favor clique em guardar novamente.");
            return false;
                
       }
       
       
        var clientid =$("input[name=clientid]").val();
        var name = $("input[name=name]").val();
        var email= $("input[name=email]").val();
        var type1= $("input[name=type1").val();
         var _originalType= $("input[name=_originalType").val();
        type1 = ( _originalType === 'invoicesauto' ? 'invoicesauto'  : type1  );
       
       
        /*UPDATE 2020 CODE*/
        var address = $('.client_address, .address').val();
        var city= $("input[name=city").val();
        var city2= $("select[name=city2").val();
       
        var fiscal_id = $('.fiscal_id').val();
        var itemDescription = $('.itemDescription').val();
        var itemUnitPrice = $('.itemUnitPrice').val();
        var itemQuantity = $('.itemQuantity').val();
        var itemTax = $('.itemTax').val();
       
        fiscal_id = ( $('.fiscal_id').val() == '' ? '999999999' : fiscal_id );
        if(clientid=='' && name=='' || name==undefined || address == '' || itemDescription == '' ||  itemUnitPrice == '' ||  itemQuantity == '' ||  itemTax == '' ||  ( city == '' && city2 == '' ) ){
        
         $("input[name=name]").css("border", "1.5px solid red");
         $(".itemDescription").css("border", "1.5px solid red");
         $(".itemUnitPrice").css("border", "1.5px solid red");
         $(".itemQuantity").css("border", "1.5px solid red");
         $(".itemTax").css("border", "1.5px solid red");
         $(".client_address, .address").css("border", "1.5px solid red");
         $("select[name=city]").css("border", "1.5px solid red");
         $("select[name=city2]").css("border", "1.5px solid red");
         $("input[name=name]").focus();
         $('.EI03').show();
         $("#error").text('Existem campos obrigatórios.');
       
        $(window).click(function(){
            
             $("input[name=name]").css("border", "1.5px solid #ccc");
             $(".itemDescription").css("border", "1.5px solid  #ccc");
             $(".itemUnitPrice").css("border", "1.5px solid  #ccc");
             $(".itemQuantity").css("border", "1.5px solid  #ccc");
             $(".itemTax").css("border", "1.5px solid  #ccc");
             $(".client_address, .address").css("border", "1.5px solid  #ccc");
             $("select[name=city]").css("border", "1.5px solid  #ccc");
             $("select[name=city2]").css("border", "1.5px solid  #ccc");
                 
        });
        
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
         return false;
        }
        /*END NEW UPDATE LINE*/
        var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }
       
      // return false;
         /*UPDATE 2020 CODE*/       
        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
       
        // email validator
        var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
       
        //validate email
        if (!emailre.test(email) && email!='') {
         $('.EI03').show();
         $("#error").text('Email inválido : '+email);
         $(email).focus();
         window.scrollTo(500, 0);
         $("#btnRascunho").removeProp("disabled");
         return false;
        }
       
        var i = 0;
        $(".items").each(function () { i++; });
       
        if(i==0){
        $('.EI03').show();
        $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
         return false;
        }

            // VERIFICAR A DATA DA ULTIMA FACTURA
            var dataChoise = $("input[name=idate]").val();
            var serieChoise = $("#serie_choice option:selected").val();
            var typeDoc =  $("input[name=type]").val();


            $.ajax( {
                 url: "private/includes/sql_insert.php?_comparedata&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Data não pode ser anterior à do último documento.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                       
                  // -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
                $.ajax( {
                 url: "private/includes/sql_insert.php?_fivedayspast&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                     console.log(response);
                    // return false;
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data da factura não pode ser inferior a 5 dias da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                        
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
                

            
            

           $.ajax( {
                 url: "private/includes/sql_insert.php?_newinvoice&clientid="+clientid+"&items="+items, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: formData,
                  processData: false,
                     contentType: false,

                 success: function(response) {
                      if(response=='E1'){
    
                     $('.EI03').show();
                     $("input[name=name]").focus();
                     window.scrollTo(500, 0);
                     $('#error').text('Este nome não está disponível.');
                     $("#btnRascunho").removeProp("disabled");
                     return false;

                      }else if(response=='E2x'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data de vencimento não pode ser inferior á da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                         
                    }else if(response=='E11'){ 
    
                         $('.EI03').show();
                         $("input[name=name]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Contribuinte não está disponível.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                
                   }else{//alert(response);
                   window.location= "./"+type1+"/"+response;
                     }  
                 }
                
             });// END AJAX QUERY
            
                    }
                 }
            });
            // END -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
            
                    }  
                 }
                
                
             });// END COMPARE DATA SCRIPT
            
            
        }));// END SCRIPT INVOICE




/* PUT CODE EDITINVOCE */
    $("#editInvoices").off('submit');
           $("#editInvoices").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

        var _semImposto = $(".to_compareSImposto").attr("dir");
        var _comImposto = $(".to_compareImposto").attr("dir");
        var _incidencia = $("._incidencia").attr("dir");
        var _valorX     = $("._valorX").attr("dir");
        
       
       if( _semImposto != _incidencia && _comImposto != _valorX ){
            $("#btnRascunho").removeProp("disabled");
            $('.EI03').show();
            $("#error").text("A sua ligação está lenta, por favor clique em guardar novamente.");
            return false;
                
       }
       
    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var ext_number = $("input[name=ext_number]").val();
    var email= $("input[name=email]").val();
    var type1= $("input[name=type1").val();
   
    /*NEW UPDATE LINE*/
    var address = $('.client_address, .address').val();
    var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
   
    var fiscal_id = $('.fiscal_id').val();
    var itemDescription = $('.itemDescription').val();
    var itemUnitPrice = $('.itemUnitPrice').val();
    var itemQuantity = $('.itemQuantity').val();
    var itemTax = $('.itemTax').val();


    fiscal_id = ( $('.fiscal_id').val() == '' ? '999999999' : fiscal_id );
     if(clientid=='' && name=='' ||  ext_number=='' || name==undefined || address == '' || itemDescription == '' ||  itemUnitPrice == '' ||  itemQuantity == '' ||  itemTax == '' ||  ( city == '' && city2 == '' ) ){
       
        $("input[name=name]").css("border", "1.5px solid red");
        $(".client_address, .address").css("border", "1.5px solid red");
        $(".itemDescription").css("border", "1.5px solid red");
        $(".itemUnitPrice").css("border", "1.5px solid red");
        $(".itemQuantity").css("border", "1.5px solid red");
        $(".itemTax").css("border", "1.5px solid red");
        $("select[name=city]").css("border", "1.5px solid red");
        $("select[name=city2]").css("border", "1.5px solid red");
        $("input[name=ext_number]]").css("border", "1.5px solid red");
        $("input[name=name]").focus();
        $('.EI03').show();
        $("#error").text('Existem campos obrigatórios.');

      window.scrollTo(500, 0);
        return false;
    }
  /*END NEW UPDATE LINE*/
        $(window).click(function(){
            
             $("input[name=name]").css("border", "1.5px solid #ccc");
             $(".itemDescription").css("border", "1.5px solid  #ccc");
             $(".itemUnitPrice").css("border", "1.5px solid  #ccc");
             $(".itemQuantity").css("border", "1.5px solid  #ccc");
             $(".itemTax").css("border", "1.5px solid  #ccc");
             $(".client_address, .address").css("border", "1.5px solid  #ccc");
             $("select[name=city]").css("border", "1.5px solid  #ccc");
             $("select[name=city2]").css("border", "1.5px solid  #ccc");
                 
        });
 
       var isento = 0;
       var i = 0;
       var superIsento = 0;
       $(".items").each(function () {
       var p = $(this).find('.itemTax').val();
       var pp = $(this).find('.itemTax').attr('alt');
   i++;
       if(p=='0.00' && pp == '' ){
            isento=1;
            superIsento=1;
              $(this).find('.itemTax').css('border', '1.5px solid #f00');
       }
      
    });

    if(isento==1 && superIsento==1 ){
       $('.EI03').show();
       $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
        window.scrollTo(500, 0);
        //$("#exemption_reason").css('border-color', 'red');
        return false;
    }
   
 
   
   
   
       

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false;
    }
           
   
    /*UPDATE 2020 CODE*/       
 /*UPDATE 2020 CODE*/       
        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                 $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
    
 
           
           
             // VERIFICAR A DATA DA ULTIMA FACTURA
            var dataChoise = $("input[name=idate]").val();
            var serieChoise = $("#serie_choice option:selected").val();
            var typeDoc =  $("input[name=type]").val();

            $.ajax( {
                 url: "private/includes/sql_insert.php?_comparedata&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                    
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('Data não pode ser anterior à do último documento.');
                         return false;
                    }else{

        
        // -- BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA
            $.ajax( {
                 url: "private/includes/sql_insert.php?_fivedayspast&dataChoise="+dataChoise+"&serieChoise="+serieChoise+"&typeDoc="+typeDoc, // Url to which the request is send
                 type: "POST",          // Type of request to be send, called as method
                  data: "dataChoise="+dataChoise,
                  processData: false,
                     contentType: false,
                 success: function(response) {
                     console.log(response);
                    // return false;
                    //alert(response);
                    if(response=='E1'){
                         $('.EI03').show();
                         $("input[name=idate]").focus();
                         window.scrollTo(500, 0);
                         $('#error').text('A data da factura não pode ser inferior a 5 dias da data actual.');
                         $("#btnRascunho").removeProp("disabled");
                         return false;
                    }else{
                        
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
                     
 
                      $.ajax( {
                            url: "private/includes/sql_insert.php?_editInvoice&clientid="+clientid+"&items="+items, // Url to which the request is send
                            type: "POST",          // Type of request to be send, called as method
                             data: formData,
                             processData: false,
                                contentType: false,
                            success: function(response) {
                                //alert(response);
                                 if(response=='E1'){
                                    $('.EI03').show();
                                    $("input[name=name]").focus();
                                    window.scrollTo(500, 0);
                                    $('#error').text('Este nome não está disponível.');
                                    return false;
                                    
                                 }else if(response=='E2x'){
                                     $('.EI03').show();
                                     $("input[name=idate]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('A data de vencimento não pode ser inferior á da data actual.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                                 }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                              }else{//alert(response);
                            window.location= "./"+type1+"/"+response;
                                }  
                            }
                           
                        });
                       
                    }
                 }
            });// --END BLOEQUED WHEN NEW DOCUMENT DATA JUST PASS FIVE DAY OF THE CURRENT DATA  
                    }
                 }
            });
                    
}));        




$("#newProforma").off('submit');
           $("#newProforma").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);
var _semImposto = $(".to_compareSImposto").attr("dir");
        var _comImposto = $(".to_compareImposto").attr("dir");
        var _incidencia = $("._incidencia").attr("dir");
        var _valorX     = $("._valorX").attr("dir");
        
       
       if( _semImposto != _incidencia && _comImposto != _valorX ){
            $("#btnRascunho").removeProp("disabled");
            $('.EI03').show();
            $("#error").text("A sua ligação está lenta, por favor clique em guardar novamente.");
            return false;
                
       }
       
    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var type1= $("input[name=type1").val();
    var address = $('.client_address, .address').val();
    var city= $("input[name=city").val();
    var city2= $("select[name=city2").val(); 
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
      $("#btnRascunho").removeProp("disabled");
        return false; 
    }
 
    var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email) && email!='') {
        $('.EI03').show();
        $("#error").text('Email inválido : '+email); 
        $(email).focus();
        window.scrollTo(500, 0);
        $("#btnRascunho").removeProp("disabled");
        return false;
    }

     var i = 0;
     $(".items").each(function () { i++; });

    if(i==0){
        $('.EI03').show();
        $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
        $("#btnRascunho").removeProp("disabled");
        window.scrollTo(500, 0);
        return false; 
    }
     /*UPDATE 2020 CODE*/       
        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });

     /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
                

                  $.ajax( {
                        url: "private/includes/sql_insert.php?_newproforma&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                $('.EI03').show();
                                $("input[name=name]").focus();
                                window.scrollTo(500, 0);
                                $('#error').text('Este nome não está disponível.');
                                $("#btnRascunho").removeProp("disabled");
                                return false;
                             }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                          }else{//alert(response);
                           window.location= "./estimates/"+response;
                            }   
                        } 
                        
                    });
}));









$("#editProforma").off('submit');
           $("#editProforma").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);
    
    var _semImposto = $(".to_compareSImposto").attr("dir");
        var _comImposto = $(".to_compareImposto").attr("dir");
        var _incidencia = $("._incidencia").attr("dir");
        var _valorX     = $("._valorX").attr("dir");
        
       
       if( _semImposto != _incidencia && _comImposto != _valorX ){
            $("#btnRascunho").removeProp("disabled");
            $('.EI03').show();
            $("#error").text("A sua ligação está lenta, por favor clique em guardar novamente.");
            return false;
                
       }
       
    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var type1= $("input[name=type1").val();
    var address = $('.client_address, .address').val();
    var city= $("input[name=city").val();
    var city2= $("select[name=city2").val(); 
     if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


       var isento = 0;
       var i = 0;
       var superIsento = 0;
       $(".items").each(function () {
       var p = $(this).find('.itemTax').val();
       var pp = $(this).find('.itemTax').attr('alt');
   i++;
       if(p=='0.00' && pp == '' ){
            isento=1;
            superIsento=1;
              $(this).find('.itemTax').css('border', '1.5px solid #f00');
       }
      
    });

    if(isento==1 && superIsento==1 ){
       $('.EI03').show();
       $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
        window.scrollTo(500, 0);
        //$("#exemption_reason").css('border-color', 'red');
        return false;
    }

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }
    
     /*UPDATE 2020 CODE*/       
        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });

     /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                 $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/


                  $.ajax( {
                        url: "private/includes/sql_insert.php?_editInvoice&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                    $('.EI03').show();
                                    $("input[name=name]").focus();
                                    window.scrollTo(500, 0);
                                    $('#error').text('Este nome não está disponível.');
                                    return false;
                                 }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                          }else{//alert(response);
                         window.location= "./"+type1+"/"+response;
                            }   
                        } 
                        
                    });
}));





$("#newGuides").off('submit');
           $("#newGuides").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var address = $('.client_address, .address').val();
    var delivery_date= $("input[name=delivery_date]").val();
    var load_site= $("textarea[name=load_site]").val();
    var delivery_site= $("textarea[name=delivery_site]").val();
    var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
     
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


     if(delivery_date==''){
       $("input[name=delivery_date]").css("border", "1.5px solid red");
        $('.EI03').show();
        $("#error").text("Data de carga é um campo obrigatório.");
        window.scrollTo(500, 0);
        delivery_date.focus();
       return false; 
    }

    if(load_site==''){
      $("textarea[name=load_site]").css("border", "1.5px solid red");
       $('.EI03').show();
       $("#error").text("Local de carga é um campo obrigatório.");
       window.scrollTo(500, 0);
       return false; 
    }

    if(delivery_site==''){
      $("textarea[name=delivery_site]").css("border", "1.5px solid red");
       $('.EI03').show();
       $("#error").text("Local de entrega é um campo obrigatório.");
       window.scrollTo(500, 0);
       return false; 
    }

 
    var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email) && email!='') {
        $('.EI03').show();
        $("#error").text('Email inválido : '+email); 
        $(email).focus();
        window.scrollTo(500, 0);
        return false;
    }

     var i = 0;
     $(".items").each(function () { i++; });

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }

        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
      /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/


             $.ajax( {
                        url: "private/includes/sql_insert.php?_newguide&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                $('.EI03').show();
                                 $("input[name=name]").focus();
                                window.scrollTo(500, 0);
                                $('#error').text('Este nome não está disponível.');
                                return false;
                             }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                          }else{//alert(response);
                          window.location= "guides/"+response;
                            }   
                        } 
                        
                    });
}));



$("#editGuides").off('submit');
           $("#editGuides").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var address = $('.client_address, .address').val();
    var delivery_date= $("input[name=delivery_date]").val();
    var load_site= $("textarea[name=load_site]").val();
    var delivery_site= $("textarea[name=delivery_site]").val();
    var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
     
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


     if(delivery_date==''){
       $("input[name=delivery_date]").css("border", "1.5px solid red");
        $('.EI03').show();
        $("#error").text("Data de carga é um campo obrigatório.");
        window.scrollTo(500, 0);
        delivery_date.focus();
       return false; 
    }

    if(load_site==''){
      $("textarea[name=load_site]").css("border", "1.5px solid red");
       $('.EI03').show();
       $("#error").text("Local de carga é um campo obrigatório.");
       window.scrollTo(500, 0);
       return false; 
    }

    if(delivery_site==''){
      $("textarea[name=delivery_site]").css("border", "1.5px solid red");
       $('.EI03').show();
       $("#error").text("Local de entrega é um campo obrigatório.");
       window.scrollTo(500, 0);
       return false; 
    }
     
    

       var isento = 0;
       var i = 0;
       var superIsento = 0;
       $(".items").each(function () {
       var p = $(this).find('.itemTax').val();
       var pp = $(this).find('.itemTax').attr('alt');
   i++;
       if(p=='0.00' && pp == '' ){
            isento=1;
            superIsento=1;
              $(this).find('.itemTax').css('border', '1.5px solid #f00');
       }
      
    });

    if(isento==1 && superIsento==1 ){
       $('.EI03').show();
       $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
        window.scrollTo(500, 0);
        //$("#exemption_reason").css('border-color', 'red');
        return false;
    }

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }

        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
      /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/

                  $.ajax( {
                        url: "private/includes/sql_insert.php?_editGuide&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                $('.EI03').show();
                                 $("input[name=name]").focus();
                                window.scrollTo(500, 0);
                                $('#error').text('Este nome não está disponível.');
                                return false;
                             }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                          }else{//alert(response);
                        window.location= "guides/"+response;
                            }   
                        } 
                        
                    });
}));




$("#newOrder").off('submit');
           $("#newOrder").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var address = $('.client_address, .address').val();
    var delivery_date= $("input[name=delivery_date]").val();
   var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
     
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


     if(delivery_date==''){
       $("input[name=delivery_date]").css("border", "1.5px solid red");
        $('.EI03').show();
        $("#error").text("Data de carga é um campo obrigatório.");
        window.scrollTo(500, 0);
        delivery_date.focus();
       return false; 
    }

   
 
    var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email) && email!='') {
        $('.EI03').show();
        $("#error").text('Email inválido : '+email); 
        $(email).focus();
        window.scrollTo(500, 0);
        return false;
    }

     var i = 0;
     $(".items").each(function () { i++; });

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }

        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
  /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];


                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/


             $.ajax( {
                        url: "private/includes/sql_insert.php?_neworder&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                $('.EI03').show();
                                $("input[name=name]").focus();
                                window.scrollTo(500, 0);
                                $('#error').text('Este nome não está disponível.');
                                return false;
                             }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                          }else{//alert(response);
                          window.location= "orders/"+response;
                            }   
                        } 
                        
                    });
}));


$("#editOrder").off('submit');
           $("#editOrder").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var address = $('.client_address, .address').val();
    var delivery_date= $("input[name=delivery_date]").val();
   var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


     if(delivery_date==''){
       $("input[name=delivery_date]").css("border", "1.5px solid red");
        $('.EI03').show();
        $("#error").text("Data de carga é um campo obrigatório.");
        window.scrollTo(500, 0);
        delivery_date.focus();
       return false; 
    }

    
    

       var isento = 0;
       var i = 0;
       var superIsento = 0;
       $(".items").each(function () {
       var p = $(this).find('.itemTax').val();
       var pp = $(this).find('.itemTax').attr('alt');
   i++;
       if(p=='0.00' && pp == '' ){
            isento=1;
            superIsento=1;
              $(this).find('.itemTax').css('border', '1.5px solid #f00');
       }
      
    });

    if(isento==1 && superIsento==1 ){
       $('.EI03').show();
       $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
        window.scrollTo(500, 0);
        //$("#exemption_reason").css('border-color', 'red');
        return false;
    }

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }
    $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
      /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/


                  $.ajax( {
                        url: "private/includes/sql_insert.php?_editOrder&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                $('.EI03').show();
                                $("input[name=name]").focus();
                                window.scrollTo(500, 0);
                                $('#error').text('Este nome não está disponível.');
                                return false;
                             }else if(response=='E11'){ 
    
                                     $('.EI03').show();
                                     $("input[name=name]").focus();
                                     window.scrollTo(500, 0);
                                     $('#error').text('Contribuinte não está disponível.');
                                     $("#btnRascunho").removeProp("disabled");
                                     return false;
                                     
                          }else{//alert(response);
                         window.location= "orders/"+response;
                            }   
                        } 
                        
                    });
}));


/* START NEW DELIVERY */


$("#newDelivery").off('submit');
           $("#newDelivery").on('submit',(function(e) {

                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var address = $('.client_address, .address').val();
    var delivery_date= $("input[name=delivery_date]").val();
   var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
     
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


     if(delivery_date==''){
       $("input[name=delivery_date]").css("border", "1.5px solid red");
        $('.EI03').show();
        $("#error").text("Data de carga é um campo obrigatório.");
        window.scrollTo(500, 0);
        delivery_date.focus();
       return false; 
    }

   
 
    var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }

    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email) && email!='') {
        $('.EI03').show();
        $("#error").text('Email inválido : '+email); 
        $(email).focus();
        window.scrollTo(500, 0);
        return false;
    }

     var i = 0;
     $(".items").each(function () { i++; });

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }

        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
  /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];


                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/


             $.ajax( {
                        url: "private/includes/sql_insert.php?_newDelivery&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                            //alert(response);
                             if(response=='E1'){ 

                            $('.EI03').show();
                            $("input[name=name]").focus();
                            window.scrollTo(500, 0);
                            $('#error').text('Este nome não está disponível.');
                            return false;
                         }else if(response=='E11'){ 
    
                             $('.EI03').show();
                             $("input[name=name]").focus();
                             window.scrollTo(500, 0);
                             $('#error').text('Contribuinte não está disponível.');
                             $("#btnRascunho").removeProp("disabled");
                             return false;
                                     
                          }else{//alert(response);
                          window.location= "deliverys/"+response;
                            }   
                        } 
                        
                    });
}));


$("#editDelivery").off('submit');
           $("#editDelivery").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var name = $("input[name=name]").val();
    var email= $("input[name=email]").val();
    var address = $('.client_address, .address').val();
    var delivery_date= $("input[name=delivery_date]").val();
   var city= $("input[name=city").val();
    var city2= $("select[name=city2").val();
    if(clientid=='' && name=='' || address == '' || name==undefined ||  ( city == '' && city2 == '' )){
         $('.EI03').show();
       $("#error").text("Deve adicionar um contacto ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


     if(delivery_date==''){
       $("input[name=delivery_date]").css("border", "1.5px solid red");
        $('.EI03').show();
        $("#error").text("Data de carga é um campo obrigatório.");
        window.scrollTo(500, 0);
        delivery_date.focus();
       return false; 
    }

    
    

       var isento = 0;
       var i = 0;
       var superIsento = 0;
       $(".items").each(function () {
       var p = $(this).find('.itemTax').val();
       var pp = $(this).find('.itemTax').attr('alt');
   i++;
       if(p=='0.00' && pp == '' ){
            isento=1;
            superIsento=1;
              $(this).find('.itemTax').css('border', '1.5px solid #f00');
       }
      
    });

    if(isento==1 && superIsento==1 ){
       $('.EI03').show();
       $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
        window.scrollTo(500, 0);
        //$("#exemption_reason").css('border-color', 'red');
        return false;
    }

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }


        $('.itemDiscount').each(function() {
            if($(this).val() < 0 ||  $(this).val() > 100  ){
                $('.EI03').show();
                $("#error").text("Desconto deve estar no intervalo entre 0 e 100%.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                $("#btnRascunho").removeProp("disabled");
                return false;
            }
        });
        
        $('.itemUnitPrice').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("O preço unitário não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
        $('.itemQuantity').each(function() {
            if($(this).val() < 0 ){
                $("#btnRascunho").removeProp("disabled");
                $('.EI03').show();
                $("#error").text("A quantidade não deve ser inferior a zero.");
                window.scrollTo(500, 0);
                $(this).val().css('border-color', 'red');
                return false;
            }
        });
      /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################  
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/


                  $.ajax( {
                        url: "private/includes/sql_insert.php?_editDelivery&clientid="+clientid+"&items="+items, // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(response) {
                             if(response=='E1'){ 

                                $('.EI03').show();
                                $("input[name=name]").focus();
                                window.scrollTo(500, 0);
                                $('#error').text('Este nome não está disponível.');
                                return false;
                             }else if(response=='E11'){ 
    
                                 $('.EI03').show();
                                 $("input[name=name]").focus();
                                 window.scrollTo(500, 0);
                                 $('#error').text('Contribuinte não está disponível.');
                                 $("#btnRascunho").removeProp("disabled");
                                 return false;
                                     
                          }else{//alert(response);
                         window.location= "deliverys/"+response;
                            }   
                        } 
                        
                    });
}));

/* END NEW DELIVERY */



$("#new_credit_note").off('submit');
$("#new_credit_note").on('submit',(function(e) {

 e.preventDefault();
var formData = new FormData($(this)[0]);

    var clientid =$("input[name=clientid]").val();
    var type1= $("input[name=type1").val();
    if(clientid==''){
        alert('Deve adicionar um contacto ao documento.');
        return false; 
    }

       var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

        if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         $("#btnRascunho").removeProp("disabled");
         return false;
        }

    var i = 0;
     $(".items").each(function () { i++; });

    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }

    
      /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            
            
            $.ajax( {
                        url: "private/includes/sql_insert.php?_newcreditnote&clientid="+clientid+"&items="+items, // Url to which the request is send
                        type: "POST",          // Type of request to be send, called as method
                         data: formData,
                         processData: false,
                            contentType: false,

                        success: function(response) {
                            //alert(response);
                            //console.log(response);
                            //return false;
                             if(response=='E1'){ 

                            $('.EI03').show();
                            $("input[name=name]").focus();
                            window.scrollTo(500, 0);
                            $('#error').text('Este nome não está disponível.');
                            return false;
                         }else if(response=='E11'){ 
    
                             $('.EI03').show();
                             $("input[name=name]").focus();
                             window.scrollTo(500, 0);
                             $('#error').text('Contribuinte não está disponível.');
                             $("#btnRascunho").removeProp("disabled");
                             return false;
                                     
                          }else{//alert(response);
                          //window.location= link.value+"/"+donnee;
                          window.location= "./creditnotes/"+response;
                            }   
                        } 
                        
                    });
                    
}));







function insertcreditnote2(form,clientid,clientfid,invoice_type,invoice_id,doc_id,doc_type,i_number,i_date,vencimento,observations,retention,vref,serie,csum,cdisc,cret,cstax,cwtax,ctotal,due_date,link,currencySel,currencyInput,ext_document,ext_serie,ext_number){



             var isento = 0;
        var superIsento = 0;
        $(".items").each(function () {
            var p = $(this).find('.itemTax').val();
            var pp = $(this).find('.itemTax').attr('alt');
             
            if(p=='0.00' && pp == '' ){
                isento=1;
                superIsento=1;
                $(this).find('.itemTax').css('border', '1.5px solid #f00');

            }
             
        });

     
      if (ext_number.value == '') {
        $(ext_number).css("border", "1.5px solid red");
        ext_number.focus();
         $("#error").text("Deve preencher o número do documento.");
        return false;
    }
    
    //var exemption = $("#exemption_reason").val();
    
    if(isento==1 && superIsento==1 ){
    
        $('.EI03').show();
        $("#error").text("Existem itens com imposto de 0%, sem motivo de isenção.");
         window.scrollTo(500, 0);
         //pp.css('border-color', 'red');
         return false;
        }

    var i = 0;
     $(".items").each(function () { i++; });

    //alert(i);
    
    if(i==0){
       $('.EI03').show();
       $("#error").text("Deve adicionar no mínimo 1 item ao documento.");
      window.scrollTo(500, 0);
        return false; 
    }

      /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/
            var price= []; 
            var quantity=[];
            var discount =[];
            var description = [];
            var itemcode = [];
            var tax = [];
            var exemption_code = [];

                $('.itemUnitPrice').each(function() {
                price.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemQuantity').each(function() {
                qt = $(this).val().replace(",", ".");
                quantity.push(qt); //add to arraylist using .push()
                });
                //
                $('.itemDiscount').each(function() {
                discount.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemDescription').each(function() {
                  description.push($(this).val()); //add to arraylist using .push()
                });
                //
                $('.itemTax').each(function() {
                  tax.push($(this).val()); //add to arraylist using .push()
                });
                $('.itemSelector').each(function() {
                  itemcode.push($(this).val()); //add to arraylist using .push()
                });
                 $('.exemption_code').each(function() {
                  exemption_code.push($(this).val()); //add to arraylist using .push()
                });
                
                //Merge arrays for upload parsing
                var bulk_array = {
                    "price": price,
                    "quantity":quantity,
                    "discount":discount,
                    "description": description,
                    "tax": tax,
                    "code":itemcode,
                    "exemption_code":exemption_code
                };

              var items = JSON.stringify(bulk_array);
            /*#########################################################
            #########################################################
            //NEW UPDATE SAVE ITEMS ONLY UPON DOCUMENT SUBMITION*/

    
     var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                if(donnee)
                {//alert(donnee);
                window.location= link.value+"/"+donnee;
                }         
            }
    };
    //alert("clientid="+clientid.value +"&clientfid="+clientfid.value+"&invoice_type="+invoice_type.value+"&invoice_id="+invoice_id.value+"&doc_id="+doc_id.value+"&doc_type="+doc_type.value+"&inumber="+i_number.value+"&idate="+i_date.value+"&vencimento="+vencimento.value+"&observations="+observations.value+"&retention="+retention.value+"&exemption_reason="+exemption_reason.value+"&vref="+vref.value+"&csum="+csum.value+"&cdisc="+cdisc.value+"&cret="+cret.value+"&cstax="+cstax.value+"&cwtax="+cwtax.value+"&ctotal="+ctotal.value+"&due_date="+due_date.value+"&currencySel="+currencySel.value+"&currencyInput="+currencyInput.value+ "&ext_document=" + ext_document.value+ "&ext_serie="+ext_serie.value+"&ext_number="+ext_number.value);
    //"clientid="+clientid.value +"&clientfid="+clientfid.value+"&invoice_type="+invoice_type.value+"&invoice_id="+invoice_id.value+"&doc_id="+doc_id.value+"&doc_type="+doc_type.value+"&inumber="+i_number.value+"&idate="+i_date.value+"&vencimento="+vencimento.value+"&observations="+observations.value+"&retention="+retention.value+"&exemption_reason="+exemption_reason.value+"&vref="+vref.value+"&csum="+csum.value+"&cdisc="+cdisc.value+"&cret="+cret.value+"&cstax="+cstax.value+"&cwtax="+cwtax.value+"&ctotal="+ctotal.value+"&due_date="+due_date.value+"&currencySel="+currencySel.value+"&currencyInput="+currencyInput.value+ "&ext_document=" + ext_document.value+ "&ext_serie="+ext_serie.value+"&ext_number="+ext_number.value

    xhr.open("POST", "private/includes/sql_insert.php?_newcreditnote2", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("clientid="+clientid.value +"&clientfid="+clientfid.value+"&invoice_type="+invoice_type.value+"&invoice_id="+invoice_id.value+"&doc_id="+doc_id.value+"&doc_type="+doc_type.value+"&inumber="+i_number.value+"&idate="+i_date.value+"&vencimento="+vencimento.value+"&observations="+observations.value+"&retention="+retention.value+"&vref="+vref.value+"&serie="+serie.value+"&csum="+csum.value+"&cdisc="+cdisc.value+"&cret="+cret.value+"&cstax="+cstax.value+"&cwtax="+cwtax.value+"&ctotal="+ctotal.value+"&due_date="+due_date.value+"&currencySel="+currencySel.value+"&currencyInput="+currencyInput.value+ "&ext_document=" + ext_document.value+ "&ext_serie="+ext_serie.value+"&ext_number="+ext_number.value+"&items="+items);
 }

function newuser(form,email,access,db,pwd,p) {
    // Check each field has a value
   if (email.value == '') {
        $(email).css("border", "1.5px solid red");
        email.focus();
        return false;
    }
    
    var pwdMailer = pwd.value;
    // Create a new element input, this will be our hashed password field. 
    p =  hex_sha512(pwd.value);
 
 var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var donnee = xhr.responseText;
                if (donnee==1) {
                location.reload(true);
                }else{    
                $('.EA01').show();
                window.scrollTo(500, 0);
                $('#Errorinfo').text(donnee);
                //alert(donnee);
                }
            }
};
xhr.open("POST", "private/authentication/register.php?sslsudo_newuser", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("email="+email.value +"&access="+access.value + "&db="+db.value+"&pwd="+p+"&pwdMailer="+pwdMailer);
return true;
}


function newtax(form,description,percentagem) {

    if (description.value == '' || percentagem.value == '') {
        $(description).css("border", "1.5px solid red");
        $(percentagem).css("border", "1.5px solid red");
        return false;
    }
      
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee == "1")
            {
             window.location="configurations/taxes";
            }else{
             window.location="configurations/taxes";
            }           
        }
};
xhr.open("POST", "private/includes/sql_insert.php?_newtax", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("description="+description.value+"&percentagem="+percentagem.value);
}



/*UPDATE 2021 CODE */
$(".calcuatesumnary").click(function(){
       $.ajax( {
             url: "private/includes/calculations.php?calcuatesumnary", // Url to which the request is send
             type: "GET",          // Type of request to be send, called as method
              data: "calcuatesumnary=calcuatesumnary",
              processData: false,
                 contentType: false,
                 beforeSend: function(){
                    $(".calcuatesumnary").empty().html('<img style="width:12px" src="assets/images/spinner_medium.gif"> <span style="font-size:"13px"> Aguarde, carregando informações</span>'); 
                 },
             success: function(response) {
               console.log(response);
               $(".calcuatesumnary").hide();
               $('.invoiceTotals').html(response);   
            return false;
                
             }
         });

});
/*UPDATE 2021 CODE */   



$("#EditMainAccForm").off('submit');
           $("#EditMainAccForm").on('submit',(function(e) {
                    e.preventDefault();
                    var formData = new FormData($(this)[0]);

   var email= $("input[name=invoice_mail").val();
     //var phone= $("input[name=phone").val();


 // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email)) {
        $(".E01").show();
        $("#error").text('Email inválido : '+email); 
        window.scrollTo(500, 0);
        $(email).focus();
        return false;
    }

   
                  $.ajax( {
                        url: "private/includes/sql_update.php?_updatebilling", // Url to which the request is send
type: "POST",          // Type of request to be send, called as method
 data: formData,
 processData: false,
    contentType: false,

                        success: function(donnee) {

                            if (donnee=='E1') {

                /*$('.E01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel inválido : '+phone);
                $($("input[name=phone")).focus();
                return false;

                }if(donnee=='E2'){ 

                $('.E01').show();
                window.scrollTo(500, 0);
                $('#error').text('Número de telemóvel deve conter 9 dígitos : '+phone);
                $($("input[name=phone")).focus();
                return false;*/

            }else{
             window.location.reload(true);    
            }      
                        } 
                        
                    });
}));


function updatebilling_(form,name,fid,email,address,pcode,city,phone) {

  if (email.value == '') {
        $(email).css("border", "1.5px solid red");
        return false;
    }


    // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email.value)) {
        $(".E01").show(); 
        window.scrollTo(500, 0);
        $(email).focus();
        return false;
    }


      if (phone.value == '') {
        $(phone).css("border", "1.5px solid red");
        return false;
    }

var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee)
            { 
            window.location.reload(true); 
            }         
        }
};
xhr.open("POST", "private/includes/sql_update.php?_updatebilling", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("name="+name.value+"&fid="+fid.value+"&email="+email.value+"&address="+address.value+"&pcode="+pcode.value+"&city="+city.value+"&phone="+phone.value);
}

 $(".btnConfirme").click(function(){
      $(".btnConfirme").prop("disabled","true");
      console.log("feito");
   });
function proxypayupload(form,accid,accname,accemail,acctel,planname,plantype,amount,var1,var2,email,phone,acdiscountcode,city2,addressinvoices,name,fid) {
    

   if (email.value == '' || phone.value == 0) {
        $(".E02").show(); 
        $(".btnConfirme").prop("disabled", false);
        $('#error').text('Os campos de email e telemóvel são obrigatórios!');  
        window.scrollTo(500, 0);
        return false;
    }


     // email validator
    var emailre = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //validate email
     if (!emailre.test(email.value)) {
        $(".E02").show();
        $(".btnConfirme").prop("disabled", false);
        $('#error').text('Email inválido.' + email.value);  
        window.scrollTo(500, 0);
        $(email).focus();
        return false;
    }
   
var xhr = getXMLHttpRequest();
xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var donnee = xhr.responseText;
            if(donnee=='E1')
            { 
            $(".E02").show();
            $(".btnConfirme").prop("disabled", false);
            $('#error').text('Número de telefone inválido.'); 
            window.scrollTo(500, 0);
            //alert(donnee);
           
            }else if(donnee=='E2'){
            $(".E02").show();
            $(".btnConfirme").prop("disabled", false);
            $('#error').text('Número de telefone deve conter 9 dígitos.'); 
            window.scrollTo(500, 0);

            }else{
            window.location= "confirmation.php?confirmationstatus=success&accname="+accname.value+"&plan="+planname.value+"&plantype="+plantype.value+"&mail="+email.value+"&phone="+phone.value;
            }       
        }
};
xhr.open("POST", "private/includes/sql_insert.php?_proxypayment", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("accid="+accid.value+"&accname="+accname.value+"&accemail="+email.value+"&acctel="+phone.value+"&planname="+planname.value+"&plantype="+plantype.value+"&amount="+amount.value+"&var1="+var1.value+"&var2="+var2.value+"&email="+email.value+"&phone="+phone.value+"&acdiscountcode="+acdiscountcode.value+"&city2="+city2.value+"&addressinvoices="+addressinvoices.value+"&name="+name.value+"&fid="+fid.value);
}

function proxyconfirm(form,plan,type) {


 /*  
   

    if (plan.value == '') {
        $(plan).css("border", "1.5px solid red");
        return false;
    }

        if (type.value == '') {
        $(type).css("border", "1.5px solid red");
        return false;
    }
     */

       window.location= "confirmation.php?payment_plan="+plan.value+"&payment_type="+type.value+"&type=confirmation";
      
}

function endlog(){ 
var xhr = getXMLHttpRequest();    
xhr.open('GET', "private/authentication/register.php?ssl_out");
xhr.onreadystatechange = function() {  
    if (xhr.readyState == 4 && xhr.status == 200) { 
        var donnee = xhr.responseText;
        if(donnee == 1)
        { 
            window.location='authentication';         
        }else{
            setTimeout(window.location='dashboard', 65000);
        }  
    }
};
xhr.send(null);   
}