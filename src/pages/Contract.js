import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../styles/Contract.css'; // Updated CSS import
import LoadingAnimation from '../components/js/LoadingAnimation';
import { useDispatch } from 'react-redux';
import { resetLoading, triggerLoading } from '../redux/ducks/appVars';
import { auth } from '../utils/firebaseConfig';
import { getUser } from '../utils/firestoreUtils';
import Paths from '../constants/navigationPages';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import RadioGroup from '../components/js/RadioGroup';

/**
 * Section Component
 * 
 * Renders a contract section with a title and content.
 * 
 * @param {string} title - The title of the section.
 * @param {JSX.Element} content - The content of the section.
 * @returns {JSX.Element}
 */
const Section = ({ title, content, _ref }) => (
  <section ref={_ref}>
    <h2 style={title? {}: {display:'none'}} >{title}</h2>
    {content}
  </section>
);

/**
 * SignatureBlock Component
 * 
 * Renders a signature block for either the client or developer.
 * 
 * @param {string} role - The role of the signer (e.g., "Client" or "Developer").
 * @returns {JSX.Element}
 */
const SignatureBlock = ({ role }) => (
  <div className="signature">
    <p><strong>{role} Signature:</strong> ______________________</p>
    <p><strong>Date:</strong> ______________________</p>
  </div>
);

const Input =  ({ initialValue = "", className = "" , set=()=>{}, placeHolder = "place holder",  editable=true, setReady=()=>{}}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const inputRef = useRef(null);
    const spanRef = useRef(null);
    const listClasses = [
        "service-list-item",
        "payment-list-item"
    ]

    // Adjust input width based on span width
    useEffect(() => {
        if (spanRef.current) {
            // console.log('--', inputValue, '--')
            const spanWidth = spanRef.current.offsetWidth;
            inputRef.current.style.width = `${spanWidth}px`; // Add some padding
            // console.log('width: ', spanWidth);
        }
    }, [inputValue, spanRef.current, inputRef.current]);
    

    const handleInputChange = (e) => {
        // if (e.tagert.value[e.target.value?.length - 1] == '\n') return;
        setInputValue(e.target.value);
        set(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        const valid = listClasses.includes(className);
        if (valid && e.keyCode === 8 && inputValue == '') {
            console.log("Backspace was pressed.");
            set("%DELETE%");
            return;
        }
        if (valid && e.keyCode === 13) {
            console.log("Enter was pressed.");
            set("%ENTER%");
            return;
        }
    }
    console.log('editable: ', editable);

    if(!editable) return <span>{inputValue}</span>;
    return (<>
        <input 
            style={editable?{ textDecoration: 'underline rgb(70,150,250) dashed 2px', textUnderlineOffset: '4px'}: {display: 'none'}}
            ref={inputRef} 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
            onKeyDown={handleInputKeyDown}
            className={`dynamic-input ${className}`} 
        />
        <span ref={spanRef} className="hidden-span" style={{display:editable?'':'none'}}>{ inputValue || ' '}</span>
        <span style={{display:editable?'none':''}} >{inputValue}</span>
    </>)
}

/**
 * Contract Component
 * 
 * Main component that renders the contract.
 * 
 * @returns {JSX.Element}
 */
const Contract = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [clientName, setClientName] = useState("[Client Name]");
    const [clientAddress, setClientAddress] = useState("[Client Address]");
    const [startDate, setStartDate] = useState("[Start Date]");
    const [endDate, setEndDate] = useState("[End Date]");
    const [warrantyPeriod, setWarrantyPeriod] = useState("30-day");
    const [hourlyRate, setHourlyRate] = useState("$23.00");
    const [terminationNoticePeriod, setTerminationNoticePeriod] = useState("14 days");
    const [paymentGracePeriod, setPaymentGracePeriod] = useState("30 days");
    const [latePaymentPercentageFee, setLatePaymentPercentageFee] = useState("[Percentage]");
    const [projectTerminationUnpaidPeriod, setProjectTerminationUnpaidPeriod] = useState("45 days");
    const [totalAmount, setTotalAmount] = useState("[Total Amount]");
    const [servicesList, setServicesList] = useState([
        "Development of a custom e-commerce website tailored to the Client's retail business.",
        "Integration of product catalog, shopping cart system, and secure payment gateway.",
        "Responsive web design to ensure compatibility across various devices.",
        "Testing and debugging of the website prior to delivery."
    ]);
    const [payments, setPayments] = useState([
        "50% upfront before starting work.",
        "50% upon project completion and delivery."
    ]);
    const [date, setDate] = useState("[Today's date]");
    const printRef = useRef();
    const [user, setUser] = useState(null);
    const [accessGranted, setAccessGranted] = useState(false);
    const [editable, setEditable] = useState(true);
    const [dpi, setDpi] = useState(96);
    const [ready, setReady] = useState(false);
    const refs = useRef([...Array(15)].map(() => React.createRef()));
    const [sections, setSections] = useState([]);
    const [listContent, setListContent] = useState(" ");
    const [selectedList, setSelectedList] = useState(0);
    const lists = [
        {label: "services", value: 0},
        {label: "payments", value: 1}
    ]

    useEffect(() => {
        dispatch(triggerLoading());
        load();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
              setUser(user); // User is signed in
              console.log('user: ', user)
              const userData = await getUser(user.uid);
              if(userData && userData.admin) {
                console.log('logged in')
                setAccessGranted(true);
                dispatch(resetLoading());
                return;
              };
              console.log('User is authenticated', user);
            } else {
              setUser(null); // No user is signed in
              console.log('User is not authenticated');
            }
            navigate(Paths.ADMIN);
        });

        // Function to calculate the DPI
        const calculateDPI = () => {
            const dpiElement = document.createElement('div');
            dpiElement.style.width = '1in'; // Set width to exactly 1 inch
            dpiElement.style.height = '1in'; 
            dpiElement.style.position = 'absolute';
            dpiElement.style.visibility = 'hidden';
            document.body.appendChild(dpiElement);

            const calculatedDpi = dpiElement.offsetWidth; // Get width in pixels

            console.log(`Your screen's DPI is: ${calculatedDpi}`);
            setDpi(calculatedDpi); // Update the state with the calculated DPI

            // Clean up the temporary element
            document.body.removeChild(dpiElement);
        };

        calculateDPI();
    
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [])

    useEffect(() => {
      if(!editable) save();
    }, [sections])

    useEffect(() => {
    // List of sections with titles and content
    const sections = [
        {
            title: null,
            content: (
                <>
                {/* Contract Effective Date */}
                <p>This Contract is made effective as of <strong><Input setReady={setReady} editable={editable} initialValue={"00/00/2024"} className={"contract-start-date"} /></strong>, by and between:</p>

                {/* Freelancer Details */}
                <p><strong>Freelancer:</strong> Abderrahmane RHANDOURI, located at 115 NE Conifer Blvd Apt C, Corvallis, OR, 97330.</p>

                {/* Client Details */}
                <p><strong>Client:</strong> <Input editable={editable} initialValue={"Client Name"} className={"client-name"} />, located at <Input editable={editable} initialValue={"[Client Address]"} className={"client-address"} />.</p>
                </>
            )
        },
        {
        title: '1. Scope of Work',
        content: (
            <>
                <p>
                The Developer agrees to provide the following services to the Client:
                </p>
                <ul>
                    {
                        servicesList.map((s, i) => <li key={i}><Input editable={editable} initialValue={s} className='service-list-item' key={i} set={(v)=>{
                            if(v=='%ENTER%') {
                                setServicesList([...servicesList, ""]);
                                return;
                            }
                            if (v=='%DELETE%') {
                                setServicesList([...servicesList.slice(0,i),...(i==servicesList.length-1? []: servicesList.slice(i+1))]);
                                return;
                            };
                            setServicesList([...servicesList.slice(0,i), v, ...(i==servicesList.length-1? []: servicesList.slice(i+1))]);
                            return;
                        }} /></li>)
                    }
                </ul>
            </>
        )
        },
        {
        title: '2. Compensation',
        content: (
            <>
            <p>
                The Client agrees to pay the Developer a total fee of <Input editable={editable} initialValue={"$200.00"} className={"total-amount"} /> for the services provided. The payment schedule is as follows:
            </p>
            <ul>
                {
                    payments.map((p, i) => <li key={i}><Input editable={editable} initialValue={p} className='payment-list-item' key={i} set={(v)=>{
                        if(v=='%ENTER%') {
                            setPayments([...payments, ""]);
                            return;
                        }
                        if (v=='%DELETE%') {
                            setPayments([...payments.slice(0,i),...(i==payments.length-1? []: payments.slice(i+1))]);
                            return;
                        };
                        setPayments([...payments.slice(0,i), v, ...(i==payments.length-1? []: payments.slice(i+1))]);
                        return;
                    }} /></li>)
                }
            </ul>
            </>
        )
        },
        {
        title: '3. Late Payment Terms',
        content: (
            <p>
            All invoices must be paid within <Input editable={editable} initialValue={"30 days"} className={"payment-grace-period"} set={setPaymentGracePeriod} /> of receipt. A late payment fee of <Input editable={editable} initialValue={"10"} className={"late-payment-fee"} />% will be applied for any overdue invoices past {paymentGracePeriod}. The Developer reserves the right to halt work if payments are delayed beyond <Input editable={editable} initialValue={"45 days"} className={"termination-unpaid-period"} />.
            </p>
        )
        },
        {
        title: '4. Revisions',
        content: (
            <p>
            The Client is entitled to <Input editable={editable} initialValue={"2"} className={"revision-rounds"} /> rounds of revisions upon project delivery. Any additional revisions beyond this will be billed at <Input editable={editable} initialValue={hourlyRate} className={"hourly-rate"} /> per hour.
            </p>
        )
        },
        {
        title: '5. Termination Clause',
        content: (
            <p>
            Either party may terminate this Agreement by giving <Input editable={editable} initialValue={"14 days"} className={"termination-notice-period"} /> written notice. Upon termination, the Client will pay for all work completed up to the termination date. If the Client terminates after the project has commenced, the Developer is entitled to keep any deposits paid.
            </p>
        )
        },
        {
        title: '6. Ownership of Work',
        content: (
            <p>
            All work provided by the Developer will remain the property of the Developer until full payment is made. Upon receipt of full payment, the Client will own the final product.
            </p>
        )
        },
        {
        title: '7. Confidentiality',
        content: (
            <p>
            Both parties agree to keep all confidential information disclosed during the project private and secure. No information will be shared with third parties without prior consent.
            </p>
        )
        },
        {
        title: '8. Warranties',
        content: (
            <p>
            The Developer provides a <Input editable={editable} initialValue={"30-day"} className={"warranty-period"} /> warranty period post-project delivery, during which any bugs or errors will be fixed free of charge. This warranty does not cover changes or new feature requests.
            </p>
        )
        },
        {
        title: '9. Expenses',
        content: (
            <p>
            Any additional expenses related to third-party tools, software, or services required for the project (e.g., domain registration, hosting) will be covered by the Client and reimbursed to the Developer if paid upfront by the Developer.
            </p>
        )
        },
        {
        title: '10. Timeline',
        content: (
            <p>
            The project will commence on <Input editable={editable} initialValue={"00/00/2024"} className={"project-start-date"} /> and is expected to be completed by <Input editable={editable} initialValue={"00/00/2024"} className={"project-end-date"} />. The Developer agrees to deliver work in accordance with this schedule, barring unforeseen delays.
            </p>
        )
        },
        {
        title: '11. Governing Law',
        content: (
            <p>
            This Agreement shall be governed by the laws of the State of Oregon, United States, without regard to its conflict of law provisions.
            </p>
        )
        },
        {
        title: '12. Acceptance',
        content: (
            <p>
            By signing below, both parties agree to the terms of this contract.
            </p>
        )
        }
    ];

    setSections(sections);
    }, [editable, servicesList, payments])
    
    

    const load = async () => {

        dispatch(resetLoading())
    }
    




  const saveList = () => {
    let newList = listContent.split(';');
    if (newList==['']) newList = [];
    switch (selectedList) {
        case 0:
            setServicesList(newList);
            break;
        case 1:
            setPayments(newList);
            break;
        
        default:
            break;
    }
  }


  
  const save = async () => {
      // const canvas = await html2canvas(printRef.current, { scale: 2 });
    //   const canvasList = [];
      const getCanvasList = refs.current.map((ref, i) => {
          // Using map to process each ref and return a promise that resolves with a canvas
          console.log('ref: ', ref)
          return html2canvas(ref.current, { scale: 2 });
        //   const canvas = await html2canvas(ref.current, { scale: 2 });
        //   canvasList.push(canvas);
        });
        
        // Wait for all promises to resolve and return the canvases
        const canvasList = await Promise.all(getCanvasList);
        
    // Now `canvasList` is an array of canvases, each corresponding to the `refs.current`
    
    // const imgData = canvas.toDataURL('image/png');

    const mmToPixels = dpi / 25.4; // Conversion factor from mm to pixels

    const verticalMarginPx = 202;
    const marginMm = 19.05;

    const imgWidth = 210 - marginMm*2; // A4 width in mm
    // const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate image height

    // Define how many images you want to split the large image into
    const splitHeight = 297 - marginMm*2 ;//2650.4 - verticalMarginPx*2; // Height for each split image (adjust as needed)
    // const totalHeight = imgHeight; // Total height of the original image

    // Number of splits
    // const numberOfSplits = Math.ceil((canvas.height - 2*verticalMarginPx) / splitHeight);

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    let currPageHeight = 0;
    let yOffset = marginMm;
    console.log('canvasList: ', canvasList);
    canvasList.map((canvas,i) => {
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        console.log(`cond ${(splitHeight - currPageHeight) < imgHeight} currPageHeight ${currPageHeight}, yOffset ${yOffset}, imgHeight ${imgHeight} canvas h ${canvas.height}, canvas w ${canvas.width}, splitHeight ${splitHeight}`);
        if ((splitHeight - currPageHeight) < imgHeight) {
            pdf.addPage();
            yOffset = marginMm;
            currPageHeight = 0;
        };
        pdf.addImage(imgData, 'PNG', marginMm, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight;
        currPageHeight += imgHeight;

    });

    /*
    // Loop through and create each split image
    for (let i = 0; i < numberOfSplits; i++) {
        const yOffset = i * splitHeight + verticalMarginPx;

        // Create a new canvas for the split image
        const splitCanvas = document.createElement('canvas');
        splitCanvas.width = canvas.width;
        splitCanvas.height = Math.min(splitHeight, canvas.height - yOffset);

        const ctx = splitCanvas.getContext('2d');

        // Draw the portion of the original canvas into the split canvas
        console.log(`canvas height: ${canvas.height} canvas width ${canvas.width} yOffset mm ${yOffset} split canvas height: ${splitCanvas.height} split canvas width: ${splitCanvas.width}`);
        ctx.drawImage(canvas, 0, yOffset, canvas.width, splitCanvas.height, 0, 0, splitCanvas.width, splitCanvas.height);

        const splitImgData = splitCanvas.toDataURL('image/png');

        // Add the split image to the PDF
        console.log(`imgWidth ${imgWidth} height ${(splitCanvas.height * imgWidth) / splitCanvas.width} splitCanvas height ${splitCanvas.height} splitCanvas w ${splitCanvas.width}`)
        pdf.addImage(splitImgData, 'PNG', 0, verticalMarginPx/(mmToPixels*2), imgWidth, (splitCanvas.height * imgWidth) / splitCanvas.width);

        // If there's more content, add a new page
        if (i < numberOfSplits - 1) {
            pdf.addPage();
        }
    }
    */
    // Save the PDF
    pdf.save('contract.pdf');
    setEditable(true)
    setReady(false)
};


   /*
    html2pdf()
    .set({
      margin: [10, 10, 10, 10], // Margins: [top, left, bottom, right]
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 }, // High resolution
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(printRef.current)
    .save();
    */

  return (
    <>
    <LoadingAnimation/>
    <div id="dpiDetector" style={{
        width: "1in", /* Set width to exactly 1 inch */
        height: "1in",
        position: "absolute",
        visibility: "hidden"}} />
    <div ref={printRef} className="contract-container">
      <h1 ref={refs.current[0]}><Input initialValue={"Freelance Services Agreement"} className={"contract-title"} editable={editable} /></h1>


      {/* Loop through the sections array to render each section */}
      {sections.map((section, index) =>  <Section _ref={refs.current[index+1]} key={index} title={section.title} content={section.content} />)}

      {/* Signatures Section */}
      <div ref={refs.current[14]} className="signatures">
        <SignatureBlock role="Client" />
        <SignatureBlock role="Developer" />
      </div>
    </div>
    <button type="button" className="save-button" onClick={()=>{setEditable(false)}} >Save as PDF</button>
    <div className="list-input">
        <RadioGroup label={"List"} name={"list"} options={lists} value={selectedList} onChange={setSelectedList} />
        <textarea name="list-content" placeholder="List content" value={listContent} onChange={(e)=>setListContent(e.target.value)} />
        <button type="button" onClick={saveList}>Save List</button>
    </div>
    </>
  );
};

export default Contract;
