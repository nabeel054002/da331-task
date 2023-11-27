import React, {useState, useEffect} from "react"

function RecommendJobs ({
    username
}) {
    const [techSkills, setTechSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
  
    const getSkills = async () => {
      const techSkillsResponse = await fetch('http://localhost:5000/get-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          skillType: 'tech_skills',
        }),
      });
      const softSkillsResponse = await fetch('http://localhost:5000/get-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          skillType: 'soft_skills',
        }),
      });
  
      const techSkillsData = await techSkillsResponse.json();
      const softSkillsData = await softSkillsResponse.json();
  
      setTechSkills(techSkillsData.skills || []);
      setSoftSkills(softSkillsData.skills || []);
      getRecommendedJobs(techSkillsData.skills)
    };

    const getRecommendedJobs = async (techSkills) => {
        const skillsStr = techSkills.join(', ');
        const response = await fetch('http://localhost:5000/recommend-jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skills: skillsStr
            })
        })
        const jsonRes = await response.json();
        console.log('jsonRes', jsonRes)
    }

    useEffect(() => {
        getSkills();
        // getRecommendedJobs();
    }, []);

    return(<div>
        {!(techSkills.length) ? 
            (<div>
                Gotta add your technical skills!
            </div>) 
        : (<div>
            Filled up your technical skills
        </div>)}
    </div>)
}

export default RecommendJobs