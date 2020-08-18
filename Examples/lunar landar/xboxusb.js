
window.outdiv = document.getElementById("device");
window.DEVICE_INFO = { "vendorId": 1118, "productId": 672, "interfaceId": 0 };
window.usbConnection = null;
decoded = 0;
function arrayBufferToString(array)
{
    if( !array )
      return "";

    return String.fromCharCode.apply(null, new Uint8Array(array));
}

function myDevicePoll()
{
  if( !window.usbConnection )
    return;

  var transferInfo = {
    "direction": "in"
    ,"endpoint": 129 // the endpoint 'address'
    ,"length": 5  // length in bytes
  };
  //console.log("pooooooooooling");

  // Claim the necessary interface
  chrome.usb.claimInterface(window.usbConnection, 0, function()
  {
    chrome.usb.interruptTransfer(window.usbConnection, transferInfo, function(usbEvent)
    {
      try
      {
        //console.log(usbEvent);

        if (usbEvent != null)
        {
          //console.log("Data length: "+ usbEvent.data.byteLength);
          if( usbEvent.resultCode == 0 )
          {
            if( usbEvent.data.byteLength > 0 )
            {
              var dataView = new Uint8Array(usbEvent.data);
              decoded = dataView[0]+":"+dataView[1]+":"+dataView[2]+":"+dataView[3]+":"+dataView[4];
              //var decoded = arrayBufferToString(usbEvent.data);
              //window.outdiv.innerHTML = window.outdiv.innerHTML + "<br/>"+ decoded;
              //console.log('Raw Data: ');
              //console.log(usbEvent.data);
              //console.log('Data (decoded): ' + decoded);
              newInput();
            }
          }
          /*else
          {
            console.warn(chrome.runtime.lastError);
          }*/

          // Next data retrieval
          lastb = b;
          b = setTimeout(myDevicePoll, 0);

        }
      }
      catch(ex)
      {
        console.error("error in interruptTransfer");
        console.error(ex);
      }
      finally
      {
        // Release the interface
        chrome.usb.releaseInterface(window.usbConnection, 0, function(){} );
      }
    });
  });
}

function initializeUsbDevice()
{
  //console.log("initializing");
    // Try to open the USB device
    chrome.usb.findDevices(window.DEVICE_INFO, function(devices)
    {
      window.devices=devices;
      if (devices)
      {
        if (devices.length > 0) {
          //console.log("Device(s) found: "+devices.length);
        } else {
          //console.log("Device could not be found");
          return;
        }
      }
      else
      {
        //console.log("Permission denied, error enumerating devices.");
        return;
      }

      //console.log('First device: ');
      //console.log(window.devices[0]);

      window.usbConnection = window.devices[0];

      // List the interfaces
      /*chrome.usb.listInterfaces(window.usbConnection, function( interfaces )
        {
          console.log("interfaces.length="+interfaces.length);

          for(i=0; i<interfaces.length;i++)
          {
            var interf = interfaces[i]
            console.log("Interface id="+interf.interfaceNumber+" Class="+interf.interfaceClass+" Subclass="+interf.interfaceSubclass+" Protocol="+interf.interfaceProtocol+" Description="+interf.description + " Endpoints="+interf.endpoints);

            for(e=0; e<interf.endpoints.length;e++)
            {
              var endp = interf.endpoints[e];
              console.log("  => Endpoint "+e+": Address="+endaddress+" type="+endtype+" direction="+enddirection+" maximumPacketSize="+endmaximumPacketSize+" usage="+endusage+" pollingInterval="+endpollingInterval+" extra="+arrayBufferToString(endextra_data));
            }
          }
        }
      );   */

      // Start polling the device for data
      //console.log("Device opened, starting poll");
      window.outdiv.innerHTML = "Device open, interface 0 claimed, listening";
      myDevicePoll();
    });
}


var requestButton = document.getElementById("requestPermission");

requestButton.addEventListener('click', function()
{
  // Must use the request permission as a direct result of an action initiated by the user
  // required by Chrome this is!
  chrome.permissions.request(
    {permissions: [{'usbDevices': [window.DEVICE_INFO] }]},
    function(result)
    {
      if (result)
      {
        //console.log('App was granted the "usbDevices" permission.');
        initializeUsbDevice();
      } else {
        //console.log('App was NOT granted the "usbDevices" permission.');
      }
    });
});




let options = {
    baudRate : 250000
  };


  function setLDmxChannel(channel, value)
  {
    //serial.write( str(floor(channel-1)) + "c" + str(floor(0)) + "w" );
    serial.write( str(floor(channel+1)) + "c" + str(floor(value)) + "w" );
    //console.log(str(floor(channel)) + "c" + str(floor(value)) + "w" );
  }

  function setLAllDmxChannel(value)
  {
    for (i =1; i <= 12; i++)
    {
    serial.write( str(floor(i)) + "c" + str(floor(value)) + "w" );
    //console.log(str(floor(i)) + "c" + str(floor(value)) + "w");
    }
  }

  function setLWinDmxChannel()
  {
    for (i =1; i <= 12; i++)
    {
      if(o == false && i%2 == 0)
      {
        serial.write( str(floor(i)) + "c" + str(floor(255)) + "w" );
        serial.write( str(floor(i-1)) + "c" + str(floor(0)) + "w" );


      }
      if(o == true && i%2 != 0)
      {
        serial.write( str(floor(i)) + "c" + str(floor(255)) + "w" );
        serial.write( str(floor(i+1)) + "c" + str(floor(0)) + "w" );
      }
    }
  }



  function setRDmxChannel(channel, value)
  {
    //serial.write( str(floor(channel-1)) + "c" + str(floor(0)) + "w" );
    serial.write( str(floor(channel+1)) + "c" + str(floor(value)) + "w" );
    //console.log(str(floor(channel)) + "c" + str(floor(value)) + "w" );
  }

  function setRAllDmxChannel(value)
  {
    for (i =13; i <= 24; i++)
    {
    serial.write( str(floor(i)) + "c" + str(floor(value)) + "w" );
    //console.log(str(floor(i)) + "c" + str(floor(value)) + "w");
    }
  }

  function setRWinDmxChannel()
  {
    for (i =13; i <= 24; i++)
    {
      if(o == false && i%2 == 0)
      {
        serial.write( str(floor(i)) + "c" + str(floor(255)) + "w" );
        serial.write( str(floor(i+1)) + "c" + str(floor(0)) + "w" );


      }
      if(o == true && i%2 != 0)
      {
        serial.write( str(floor(i)) + "c" + str(floor(255)) + "w" );
        serial.write( str(floor(i-1)) + "c" + str(floor(0)) + "w" );
      }
    }
  }


function noInput()
{
  for(var i = 0; i < 12; i++) {
     buttons[i] = false;
  }
}


function newInput()
{
  console.log(decoded);
  if(decoded == "0:5:" + player1 + ":0:8") // P1 Big Button
  {
    buttons[0] = true;
  }
  if(decoded == "0:5:" + player2 + ":0:8") // P1 Big Button
  {
    buttons[1] = true;
  }

}

function preload()
{
  img = loadImage('final.jpg');
}

function setup()
{

  serial = new p5.SerialPort();
  let portlist = serial.list();
  //console.log("1: " +portlist[0]);
  //console.log("2: " +portlist[1]);

  serial.open("COM6", options);

    // Register some callbacks

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);

    // When we some data from the serial port
    serial.on('data', gotData);

    // When or if we get an error
    serial.on('error', gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);

    setLAllDmxChannel(0)
    setRAllDmxChannel(0)

  player1 = 0; // Green
  player2 = 2; // Blue


  counter = 0;
  lastb = 0;
  b = 0;
  tiny = 20;
  small = 35;
  big = 130;
 createCanvas(displayWidth, displayHeight);
 background(50);
 buttons = [];

 for(var i = 0; i < 12; i++) {
    buttons.push(false);
 }

 pKeys= [];
 t = 0;
 Rdead = false;
 Ldead = false;
 Lbut = false;
 Rbut = false;
 Rwin = false;
 Lwin = false;
 o = false;
 speed = 0.25;
 Lboxes= [];
 Rboxes= [];
 width = displayWidth;
 height = displayHeight;
 canvas = createCanvas(displayWidth, displayHeight);
 //canvas.position(0,0);
 fullscreen();

 g =  0.00001;
 power = 75;
 Po = 0;
 Rs = 0;
 Ls = 0;

 Rsector = 4;
 Lsector = 4;

 Dr = Rs * -1;
 Dl = Ls * -1;

 Drc = 0;
 Dlc = 0;
 once = false;
 Drd = 1;
 Dld = 1;

 Racceleration = 0.0001;
 Lacceleration = 0.0001;

 Rvelocity = 0.06;
 Lvelocity = 0.06;

 Rthrust = g;
 Lthrust = g;

 ChannelL = 0;
 ChannelR = 0;


for(i = 0; i < 4;i+=1)
{
 pKeys.push(false);
}
 for(i = 0; i < 12;i+=1)
{
  Lboxes.push([0.0,i*0.08333333333]);
}

 for(i = 0; i < 12;i+=1)
{
  Rboxes.push([0.0,i*0.08333333333]);
}

background(0);
e = setInterval(setO,750);
flicker = setInterval(setFlicker,50);

}

// We are connected and ready to go
function serverConnected() {
      console.log("We are connected!");
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
//  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
//      console.log(i + " " + thelist[i]);
  //}
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is open!");
  //serial.write("1c225w");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readStringUntil("\r\n");
  //console.log(currentString);
}



function setO(){
 o = !o;
}

function setFlicker(){
 flicker = !flicker;
}



function draw(){
  //console.log("b: " +b + " lastb: " + lastb);
  //console.log(Rs);
  if(Ldead == true)
  {
    setLAllDmxChannel(255);
    Lwin = false;
  }
  if(Ldead == false && Lwin == false && Ls >= 0)
  {
    setLAllDmxChannel(map(Lsector, 1, 4, 0, 255));
    setLDmxChannel(Ls,255)
  }
  if(Ls < 0)
  {
    setLAllDmxChannel(ChannelL);
  }
  if (Lwin == true)
  {
    setLWinDmxChannel();
  }

  if (Ls+1 <= 12 && Ldead == false && Lwin == false  && Lsector < 4 && Lup == true)
  {
    if (flicker)
    {
      setLDmxChannel(Ls+1,180);
    }
    else
    {
      setLDmxChannel(Ls+1,155);
    }
  }
  if (Ls+2 <= 12 && Ldead == false && Lwin == false  && Lsector < 4 && Lup == true)
  {
    if (flicker)
    {
      setLDmxChannel(Ls+2,130);
    }
    else
    {
      setLDmxChannel(Ls+2,120);
    }
  }

  if (Lsector >= 4 && Ldead == false && Lwin == false)
  {
    setLDmxChannel(Ls,0);
  }

  if(Rdead == true)
  {
    setRAllDmxChannel(255);
    Rwin = false;
  }
  if(Rdead == false && Rwin == false && Rs >= 0)
  {
    setRAllDmxChannel(map(Rsector, 1, 4, 0, 255));
    setRDmxChannel(Rs+12,255)
  }
  if(Rs < 0)
  {
    setRAllDmxChannel(ChannelR);
  }
  if (Rwin == true)
  {
    setRWinDmxChannel();
  }


  if (Rs+1 <= 12 && Rdead == false && Rwin == false  && Rsector < 4 && Rup == true)
  {
    if (flicker)
    {
      setRDmxChannel(Rs+13,180);
    }
    else
    {
      setRDmxChannel(Rs+13,155);
    }
  }
  if (Rs+2 <= 12 && Rdead == false && Rwin == false  && Rsector < 4 && Rup == true)
  {
    if (flicker)
    {
      setRDmxChannel(Rs+14,130);
    }
    else
    {
      setRDmxChannel(Rs+14,120);
    }
  }

  if (Rsector >= 4 && Rdead == false && Rwin == false)
  {
    setLDmxChannel(Rs+12,0);
  }

  Dr = Rs * -1;
  Dl = Ls * -1;

  Racceleration += Rthrust;
  Lacceleration += Lthrust;

  Lvelocity += Lacceleration
  Rvelocity += Racceleration

  Rs += Rvelocity;
  Ls += Lvelocity;

  if(Rs > 12)
  {
    Rsector -= 1;
    Rs = 0;
    if (Rvelocity > 0.08 && Rwin == false && Rsector <= 0)
    {
      Rdead = true;
    }
    else if(Rvelocity <= 0.08 && Rwin == false && Rsector <= 0)
    {
      Rwin = true;
      setRAllDmxChannel(0);
    }
  }

  if(Rs < 0)
  {
    Rsector += 1;
    Rs = 12;
  }

  if(Rsector > 5)
  {
    Rdead = true;
  }

  if(Ls > 12)
  {
    Lsector -= 1;
    Ls = 0;
    if (Lvelocity > 0.08 && Lwin == false && Lsector <= 0)
    {
       Ldead = true;
    }
    else if(Lvelocity <= 0.08 && Lwin == false && Lsector <= 0 )
    {
      Lwin = true;
      setLAllDmxChannel(0);
    }
  }

  if(Ls < 0)
  {
    Lsector += 1;
    Ls = 12;
  }

  if(Lsector > 5)
  {
    Ldead = true;
  }
  if(keyIsPressed)
  {
    if(keyCode === 38)
      {
        pKeys[0]=true;
        pKeys[1]=false;
      }

      if(keyCode === 40)
      {
        pKeys[1]=true;
        pKeys[0]=false;
      }

      if(key == 'w')
      {
        pKeys[2]=true;
        pKeys[3]=false;
      }

      if(key == 's')
      {
        pKeys[3]=true;
        pKeys[2]=false;
      }

      if(key == 'r')
      {
        clearInterval(e);
       setup();
      }
  }
  else
  {
    if (keyCode === 38 ||keyCode === 40)
    {
     pKeys[0]=false;
     pKeys[1]=false;
    }
    if (key != 'w' ||key != 's')
    {
     pKeys[2]=false;
     pKeys[3]=false;
    }
  }
 background(0);

console.log(Lsector + "   " + Ldead)

 stroke(255);
 fill(115);

  if (pKeys[0] == true || Rbut == true || buttons[1] == true)
     {
       Rthrust = -g * power;
       Rup = true;
     }
    else {
    Rthrust = g*5;
    Rup = false;
    }

    if (pKeys[2] == true || Lbut == true || buttons[0] == true)
     {
       Lthrust = -g * power;
       console.log("THRUST!!!!!!!");
       Lup = true;
     }
     else {
       Lthrust = g*5;
       Lup = false;
     }


  Lacceleration = constrain(Lacceleration,-0.00000001,0.0001)
  Racceleration = constrain(Racceleration,-0.00000001,0.0001)

  if(Lvelocity == -0.000001)
     {
       t++;
     }

   if(Lvelocity == 0.01)
     {
       Lvelocity =  -0.000001;
     }

  if (t>= 100)
  {
    Lvelocity = 0.0001;
    t = 0;
  }

  for(i = 0; i < Rboxes.length;i+=1)
 {


   fill(map(Rsector, 1, 4, 0, 255));

   if  (Rdead == true ||
       (o == false && Rwin == true && i%2 == 0) ||
       (o == true && Rwin == true && i%2 != 0))
   {
     fill(255);
   }

   if(Rsector == 5 && Rdead == false && Rwin == false)
   {
     fill(255);
   }

   if (((Rsector == 5) ||(Rsector == 4)) && i == floor(Rs) && Rdead == false && Rwin == false)
   {
     fill(0);
   }
   if (i == floor(Rs) && Rdead == false && Rsector < 4 && Rwin == false)
   {
     fill(255)
   }

   if (i == floor(Rs+1) && Rdead == false && Rwin == false  && Rsector < 4 && Rup == true)
   {
     if (flicker)
     {
       fill(180);
     }
     else
     {
         fill(160);
     }
   }

   if (i == floor(Rs+2) && Rdead == false && Rwin == false && Rsector < 4 && Rup == true)
   {
     if (flicker)
     {
       fill(130);
     }
     else
     {
       fill(120);
     }
   }

   rect(displayWidth-100,83.3333333333*i,100,83.3333333333);
 }

 for(i = 0; i < Lboxes.length;i+=1)
 {

   fill(map(Lsector, 1, 4, 0, 255));

   if (Ldead == true ||
       (o == false && Lwin == true && i%2 == 0) ||
       (o == true && Lwin == true && i%2 != 0))
   {
     fill(255);
   }

   if(Lsector == 5 && Ldead == false && Lwin == false)
   {
     fill(255);
   }

   if (((Lsector == 5) || (Lsector == 4)) && i == floor(Ls) && Ldead == false && Lwin == false)
   {
     fill(0);
   }
   if (i == floor(Ls) && Ldead == false && Lsector < 4 && Lwin == false)
   {
     fill(255)
   }

    if (i == floor(Ls+1) && Ldead == false && Lwin == false  && Lsector < 4 && Lup == true)
    {
      if (flicker)
      {
        fill(180);
      }
      else
      {
          fill(160);
      }
    }

    if (i == floor(Ls+2) && Ldead == false && Lwin == false && Lsector < 4 && Lup == true)
    {
      if (flicker)
      {
        fill(130);
      }
      else
      {
          fill(120);
      }
    }

   rect(0,83.3333333333*i,100,83.3333333333);

 }
  if (lastb == b)
  {
    counter += 1;
  }
  else{
    counter = 0;
  }
  if (counter >= 8)
  {
    noInput();
  }
  lastb = b;


  //console.log("mouseX: " + mouseX + " mouseY: " + mouseY)
     if(buttons[0] == false) // Big button
     {
       //ellipse(106,93,big,big);
     }
}
