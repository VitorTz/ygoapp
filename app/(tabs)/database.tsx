import { SafeAreaView, StyleSheet} from 'react-native'
import CardSearch from '@/components/CardSearch'
import { AppStyle } from '../../style/AppStyle'


const Database = () => {

  return (
    <SafeAreaView style={[AppStyle.safeArea, {padding: 10, alignItems: "center", justifyContent: "center", paddingBottom: 80}]} >
      <CardSearch/>
    </SafeAreaView>
  )
}

export default Database

const styles = StyleSheet.create({})