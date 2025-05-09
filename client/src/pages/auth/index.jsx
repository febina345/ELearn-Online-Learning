import CommonForm from "@/components/common-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin');
  const { signInFormData,
    setSignInFormData,
    signUpFormData,
    handleRegisterUser,
    handleLoginUser,
    setSignUpFormData} = useContext(AuthContext)

  

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid(){
    return (
    signInFormData  && 
    signInFormData.userEmail  !== '' && 
    signInFormData.password !== ''
    );
  }

  function checkIfSignUpFormIsValid(){
    return(
      signUpFormData  && 
      signUpFormData.userName  !== '' &&
      signUpFormData.userEmail  !== '' && 
      signUpFormData.password !== ''
    )
  }
  console.log(signInFormData)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={'/'} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4 " />
          <span className="font-extrabold text-xl">ONLINE LEARNING PLATFORM</span>
        </Link>
      </header>
      
      {/* Center the Tabs in the page */}
      <div className="flex flex-1 items-center justify-center bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="flex w-full justify-center gap-4 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
          <Card className="p-6 space-y-4">
            <CardHeader>
              <CardTitle>
               Sign In to your Account 
              </CardTitle>
              <CardDescription>
                Enter your email and Password to get through Your Account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CommonForm
              formControls={signInFormControls}
              buttonText={'Sign In'}
              formData={signInFormData}
              setFormData={setSignInFormData}
              isButtonDisabled={!checkIfSignInFormIsValid()}
              handleSubmit={handleLoginUser}
              />
           
            </CardContent>
        
          </Card>
            </TabsContent>
          <TabsContent value="signup">
           <Card>
            <CardHeader>
              <CardTitle>
                 Create a new Account for your E-Learning Journey
              </CardTitle>
              <CardDescription>
                Enter your credentials for Sign Up to your Learning Platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CommonForm
              formControls={signUpFormControls}
              buttonText={'Sign up'}
              formData={signUpFormData}
              setFormData={setSignUpFormData}
              isButtonDisabled={!checkIfSignUpFormIsValid()}
              handleSubmit={handleRegisterUser}
              />
           
            </CardContent>
           </Card>
            </TabsContent>
        </Tabs>
      </div>
      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>ERIYADAN FEBINA   |   ID:FEBIN57109  |  UNIVERSITY OF ESSEX</p>
      </footer>
    </div>
  );
}

export default AuthPage;
