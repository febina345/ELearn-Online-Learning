import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"; 


function FormControls({formControls = [],formData, setFormData}){

    function renderComponentByType(getControlItem){
          let element = null
          switch (getControlItem.componentType) {
            case "input":
                element=<Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                />
                
                break;
            case "select":
                element=<Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={getControlItem.label}/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            getControlItem.options && getControlItem.options.length > 0?
                            getControlItem.options.map(optionItem=> <SelectItem key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem>) : null
                        }
                    </SelectContent>
                </Select>
                    
                break;
            case "textarea":
                element=<Textarea
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                />
                        
                 break;
          
            default: element=<Input
            id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
            />
                break;
          }
          return element;
    }
    return(
        <div className="flex flex-col gap-3">
            {
                formControls.map(controlItem=>
                    <div key={controlItem.name}>
                        <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
                        {
                            renderComponentByType(controlItem)
                        }
                    </div>

                )
            }
        </div>
    )

}
export default FormControls;