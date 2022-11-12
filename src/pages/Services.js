import BasicCard from "../components/BasicCard"

export default function Services(props) {
  return (
    <div style={{ backgroundColor: '#334', padding: 30 }}>
      <h1>How We Help</h1>

      <div style={{ width: '90%', margin: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <BasicCard url='/calculator' text1='Project' text2='Containerization' text3='action' text4='a form of virtualization where applications run in isolated user spaces, called containers, while using the same shared operating system' />
        <BasicCard url='/calculator' text1='Walkthrough' text2='Provisioning' text3='action' text4='preparing and equipping a network to allow it to provide new services to its users' />
        <BasicCard url='/calculator' text1='Service' text2='Deployment' text3='workflow' text4='a method for quickly building and releasing complex applications' />
        <BasicCard url='/calculator' text1='Service' text2='Monitoring' text3='service' text4='continuously collecting metrics and tracking the health of containerized applications and microservices environments, in order to improve their health and performance and ensure they are operating smoothly' />
        <BasicCard url='/calculator' text1='Service' text2='Alerts' text3='service' text4='symptoms of production systems that send notifications as actionable context to the relevant stakeholder when certain conditions are met' />
        <BasicCard url='/calculator' text1='Service' text2='Orchestration' text3='asset' text4='automate the deployment, management, scaling, and networking of containers' />
        <BasicCard url='/calculator' text1='Project' text2='Infra-as-Code' text3='asset' text4='the managing and provisioning of infrastructure through code instead of through manual processes' />
        <BasicCard url='/calculator' text1='Capability' text2='Scalability' text3='feature' text4='the ability of the cluster to grow while staying within its service-level objectives' />
        <BasicCard url='/calculator' text1='Outcome' text2='Security' text3='value' text4='security in layers: Cloud, Clusters, Containers, and Code' />
        <BasicCard text1='Outcome' text2='Reliability' text3='value' text4='synonymous with stability, streamlined development and operations, and a better user experience' />
        <BasicCard text1='Outcome' text2='Ease of mind' text3='value' text4='security, confidence, certainty, comfort, safety, assurance, reassurance, conviction, happiness and sureness' />
        <BasicCard text1='Service' text2='Jokes' text3='rare item' text4='We dont write the YAML because we like YAML' />
      </div>

    </div>
  )
}
